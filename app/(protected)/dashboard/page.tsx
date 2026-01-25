'use client';
import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { Users, DollarSign, TrendingUp, Activity, Target, Clock, BarChart3, PieChart, ChevronLeft, ChevronRight } from 'lucide-react';
import { APP_NAME } from '@/lib/config';
import Spinner from '@/components/ui/Spinner';
import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

export default function DashboardPage() {
  const [stats, setStats] = useState({
    leads: 0,
    expenses: 0,
    users: 0,
    leadStatuses: [] as any[],
    leadSources: [] as any[],
    monthlyGrowth: [] as any[],
    recentActivity: [] as any[]
  });
  const [loading, setLoading] = useState(true);

  // Refs for scrollable containers
  const primaryCardsRef = useRef<HTMLDivElement>(null);
  const secondaryCardsRef = useRef<HTMLDivElement>(null);

  // State for arrow navigation
  const [primaryArrows, setPrimaryArrows] = useState({ left: false, right: true });
  const [secondaryArrows, setSecondaryArrows] = useState({ left: false, right: true });

  // Function to check scroll position and update arrow states
  const updateArrowStates = (ref: React.RefObject<HTMLDivElement>, setArrows: (arrows: { left: boolean, right: boolean }) => void) => {
    if (ref.current) {
      const { scrollLeft, scrollWidth, clientWidth } = ref.current;
      const atStart = scrollLeft === 0;
      const atEnd = scrollLeft + clientWidth >= scrollWidth - 1; // -1 for rounding errors

      setArrows({
        left: !atStart,
        right: !atEnd
      });
    }
  };

  useEffect(() => {
    Promise.all([
      fetch('/api/leads').then(res => res.ok ? res.json() : []),
      fetch('/api/expenses').then(res => res.ok ? res.json() : []),
      fetch('/api/users').then(res => res.ok ? res.json() : [])
    ]).then(([leads, expenses, users]) => {
      // Process lead status distribution
      const statusCounts = leads.reduce((acc: any, lead: any) => {
        acc[lead.status] = (acc[lead.status] || 0) + 1;
        return acc;
      }, {});

      const leadStatuses = Object.entries(statusCounts).map(([status, count]) => ({
        name: status,
        value: count,
        color: getStatusColor(status)
      }));

      // Process lead sources
      const sourceCounts = leads.reduce((acc: any, lead: any) => {
        acc[lead.source] = (acc[lead.source] || 0) + 1;
        return acc;
      }, {});

      const leadSources = Object.entries(sourceCounts).map(([source, count]) => ({
        name: source,
        value: count,
        color: getSourceColor(source)
      }));

      // Mock monthly growth data (in real app, calculate from actual dates)
      const monthlyGrowth = [
        { month: 'Jan', leads: 12, expenses: 2400 },
        { month: 'Feb', leads: 19, expenses: 1398 },
        { month: 'Mar', leads: 15, expenses: 9800 },
        { month: 'Apr', leads: 25, expenses: 3908 },
        { month: 'May', leads: 22, expenses: 4800 },
        { month: 'Jun', leads: 30, expenses: 3800 }
      ];

      // Recent activity (mock data)
      const recentActivity = leads.slice(0, 5).map((lead: any) => ({
        id: lead._id,
        type: 'lead',
        title: `New lead: ${lead.name}`,
        time: new Date(lead.createdAt).toLocaleDateString(),
        status: lead.status
      }));

      setStats({
        leads: leads.length,
        expenses: expenses.length,
        users: users.length,
        leadStatuses,
        leadSources,
        monthlyGrowth,
        recentActivity
      });
    }).finally(() => setLoading(false));
  }, []);

  // Set up scroll event listeners for arrow states
  useEffect(() => {
    const primaryContainer = primaryCardsRef.current;
    const secondaryContainer = secondaryCardsRef.current;

    if (primaryContainer) {
      updateArrowStates(primaryCardsRef, setPrimaryArrows);
      primaryContainer.addEventListener('scroll', () => updateArrowStates(primaryCardsRef, setPrimaryArrows));
    }

    if (secondaryContainer) {
      updateArrowStates(secondaryCardsRef, setSecondaryArrows);
      secondaryContainer.addEventListener('scroll', () => updateArrowStates(secondaryCardsRef, setSecondaryArrows));
    }

    return () => {
      if (primaryContainer) {
        primaryContainer.removeEventListener('scroll', () => updateArrowStates(primaryCardsRef, setPrimaryArrows));
      }
      if (secondaryContainer) {
        secondaryContainer.removeEventListener('scroll', () => updateArrowStates(secondaryCardsRef, setSecondaryArrows));
      }
    };
  }, [stats]); // Re-run when stats change to ensure containers are ready

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'New / Fresh Lead': return '#3B82F6';
      case 'Interested / Warm Lead': return '#F59E0B';
      case 'Closed - Won': return '#10B981';
      case 'Closed - Lost': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const getSourceColor = (source: string) => {
    switch (source) {
      case 'Website': return '#8B5CF6';
      case 'CRM': return '#06B6D4';
      case 'Referral': return '#84CC16';
      case 'Other': return '#F97316';
      default: return '#6B7280';
    }
  };

  const getActivityStatusColor = (status: string) => {
    switch (status) {
      case 'New / Fresh Lead': return 'bg-blue-100 text-blue-700';
      case 'Interested / Warm Lead': return 'bg-yellow-100 text-yellow-700';
      case 'Closed - Won': return 'bg-green-100 text-green-700';
      case 'Closed - Lost': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  // Scroll functions for mobile card navigation
  const scrollLeft = (ref: React.RefObject<HTMLDivElement>) => {
    if (ref.current) {
      ref.current.scrollBy({ left: -280, behavior: 'smooth' });
    }
  };

  const scrollRight = (ref: React.RefObject<HTMLDivElement>) => {
    if (ref.current) {
      ref.current.scrollBy({ left: 280, behavior: 'smooth' });
    }
  };

  const Card = ({ title, value, icon: Icon, color, subtitle }: any) => (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
      <div>
        <p className="text-slate-500 font-medium mb-1">{title}</p>
        <h3 className="text-3xl font-bold text-slate-800">{loading ? <Spinner /> : value}</h3>
        {subtitle && <p className="text-sm text-slate-400 mt-1">{subtitle}</p>}
      </div>
      <div className={`p-4 rounded-xl ${color}`}>
        <Icon size={24} className="text-white" />
      </div>
    </div>
  );

  const ChartCard = ({ title, children, icon: Icon }: any) => (
    <div className="bg-white p-3 md:p-6 rounded-2xl border border-slate-100 shadow-sm">
      <div className="flex items-center gap-2 mb-2 md:mb-4">
        <Icon size={18} className="text-slate-600 md:w-5 md:h-5" />
        <h3 className="text-sm md:text-lg font-semibold text-slate-800">{title}</h3>
      </div>
      <div className="h-56 md:h-64">
        {children}
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
        <p className="text-slate-500">Welcome back to {APP_NAME}</p>
      </div>

      {/* Primary KPIs - Horizontal scroll on mobile */}
      <div className="relative px-12 md:px-0">
        <div ref={primaryCardsRef} className="overflow-x-auto pb-4 scrollbar-hide">
          <div className="flex gap-4 md:grid md:grid-cols-2 lg:grid-cols-4 md:gap-6 min-w-max md:min-w-0">
            <Link href="/leads" className="flex-shrink-0 w-64 md:w-auto">
              <Card
                title="Total Leads"
                value={stats.leads}
                icon={Users}
                color="bg-blue-500"
                subtitle="Active pipeline"
              />
            </Link>
            <Link href="/expenses" className="flex-shrink-0 w-64 md:w-auto">
              <Card
                title="Total Expenses"
                value={stats.expenses}
                icon={DollarSign}
                color="bg-emerald-500"
                subtitle="This month"
              />
            </Link>
            <div className="flex-shrink-0 w-64 md:w-auto">
              <Card
                title="Conversion Rate"
                value="12%"
                icon={TrendingUp}
                color="bg-violet-500"
                subtitle="From leads to deals"
              />
            </div>
            <div className="flex-shrink-0 w-64 md:w-auto">
              <Card
                title="Active Users"
                value={stats.users}
                icon={Activity}
                color="bg-orange-500"
                subtitle="Team members"
              />
            </div>
          </div>
        </div>
        {/* Navigation arrows for mobile */}
        <div className="md:hidden absolute left-0 top-1/2 transform -translate-y-1/2 z-10">
          <button
            onClick={() => scrollLeft(primaryCardsRef)}
            disabled={!primaryArrows.left}
            className={`bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg border border-slate-200 hover:bg-white transition-colors -ml-2 ${!primaryArrows.left ? 'opacity-50 cursor-not-allowed' : ''
              }`}
          >
            <ChevronLeft size={16} className="text-slate-600" />
          </button>
        </div>
        <div className="md:hidden absolute right-0 top-1/2 transform -translate-y-1/2 z-10">
          <button
            onClick={() => scrollRight(primaryCardsRef)}
            disabled={!primaryArrows.right}
            className={`bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg border border-slate-200 hover:bg-white transition-colors -mr-2 ${!primaryArrows.right ? 'opacity-50 cursor-not-allowed' : ''
              }`}
          >
            <ChevronRight size={16} className="text-slate-600" />
          </button>
        </div>
      </div>

      {/* Secondary KPIs - Horizontal scroll on mobile */}
      <div className="relative px-12 md:px-0">
        <div ref={secondaryCardsRef} className="overflow-x-auto pb-4 scrollbar-hide">
          <div className="flex gap-4 md:grid md:grid-cols-2 lg:grid-cols-4 md:gap-6 min-w-max md:min-w-0">
            <div className="flex-shrink-0 w-64 md:w-auto">
              <Card
                title="Pipeline Value"
                value="$2.4M"
                icon={Target}
                color="bg-indigo-500"
                subtitle="Potential revenue"
              />
            </div>
            <div className="flex-shrink-0 w-64 md:w-auto">
              <Card
                title="Avg Response Time"
                value="2.3h"
                icon={Clock}
                color="bg-cyan-500"
                subtitle="Lead response"
              />
            </div>
            <div className="flex-shrink-0 w-64 md:w-auto">
              <Card
                title="Monthly Growth"
                value="+18%"
                icon={BarChart3}
                color="bg-green-500"
                subtitle="vs last month"
              />
            </div>
            <div className="flex-shrink-0 w-64 md:w-auto">
              <Card
                title="Lead Quality Score"
                value="8.2/10"
                icon={PieChart}
                color="bg-purple-500"
                subtitle="Based on conversion"
              />
            </div>
          </div>
        </div>
        {/* Navigation arrows for mobile */}
        <div className="md:hidden absolute left-0 top-1/2 transform -translate-y-1/2 z-10">
          <button
            onClick={() => scrollLeft(secondaryCardsRef)}
            disabled={!secondaryArrows.left}
            className={`bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg border border-slate-200 hover:bg-white transition-colors -ml-2 ${!secondaryArrows.left ? 'opacity-50 cursor-not-allowed' : ''
              }`}
          >
            <ChevronLeft size={16} className="text-slate-600" />
          </button>
        </div>
        <div className="md:hidden absolute right-0 top-1/2 transform -translate-y-1/2 z-10">
          <button
            onClick={() => scrollRight(secondaryCardsRef)}
            disabled={!secondaryArrows.right}
            className={`bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg border border-slate-200 hover:bg-white transition-colors -mr-2 ${!secondaryArrows.right ? 'opacity-50 cursor-not-allowed' : ''
              }`}
          >
            <ChevronRight size={16} className="text-slate-600" />
          </button>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Lead Status Distribution" icon={PieChart}>
          <ResponsiveContainer width="100%" height="100%">
            <RechartsPieChart>
              <Pie
                data={stats.leadStatuses}
                cx="50%"
                cy="50%"
                innerRadius={35}
                outerRadius={70}
                paddingAngle={3}
                dataKey="value"
              >
                {stats.leadStatuses.map((entry, index) => (
                  <Cell key={`status-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  fontSize: '12px',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid #e2e8f0'
                }}
              />
              <Legend
                wrapperStyle={{
                  fontSize: '11px',
                  paddingTop: '10px'
                }}
                iconType="circle"
                verticalAlign="bottom"
                height={36}
              />
            </RechartsPieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Lead Sources" icon={BarChart3}>
          <ResponsiveContainer width="100%" height="100%">
            <RechartsPieChart>
              <Pie
                data={stats.leadSources}
                cx="50%"
                cy="50%"
                innerRadius={35}
                outerRadius={70}
                paddingAngle={3}
                dataKey="value"
              >
                {stats.leadSources.map((entry, index) => (
                  <Cell key={`source-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  fontSize: '12px',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid #e2e8f0'
                }}
              />
              <Legend
                wrapperStyle={{
                  fontSize: '11px',
                  paddingTop: '10px'
                }}
                iconType="circle"
                verticalAlign="bottom"
                height={36}
              />
            </RechartsPieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Monthly Performance" icon={TrendingUp}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={stats.monthlyGrowth} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="month"
                fontSize={11}
                tick={{ fontSize: 11 }}
                interval="preserveStartEnd"
              />
              <YAxis
                fontSize={11}
                tick={{ fontSize: 11 }}
                width={35}
              />
              <Tooltip
                contentStyle={{
                  fontSize: '11px',
                  borderRadius: '6px',
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid #e2e8f0'
                }}
              />
              <Legend
                wrapperStyle={{
                  fontSize: '11px',
                  paddingTop: '5px'
                }}
                iconType="line"
                verticalAlign="bottom"
                height={30}
              />
              <Line
                type="monotone"
                dataKey="leads"
                stroke="#3B82F6"
                strokeWidth={2}
                dot={{ r: 2 }}
                name="Leads"
              />
              <Line
                type="monotone"
                dataKey="expenses"
                stroke="#10B981"
                strokeWidth={2}
                dot={{ r: 2 }}
                name="Expenses"
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Recent Activity" icon={Activity}>
          <div className="h-56 md:h-64 overflow-y-auto space-y-2 md:space-y-3 pr-1 md:pr-2">
            {stats.recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-center gap-2 md:gap-3 p-2 md:p-3 bg-slate-50 rounded-lg">
                <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs md:text-sm font-medium text-slate-800 truncate">{activity.title}</p>
                  <p className="text-xs text-slate-500">{activity.time}</p>
                </div>
                <span className={`px-1.5 py-0.5 md:px-2 md:py-1 text-xs rounded-full whitespace-nowrap ${getActivityStatusColor(activity.status)}`}>
                  {activity.status}
                </span>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>
    </div>
  );
}