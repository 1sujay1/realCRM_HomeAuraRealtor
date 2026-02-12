import Link from 'next/link';
import { Users, Clock, BarChart3, Target } from 'lucide-react';
import Spinner from '@/components/ui/Spinner';

interface StatsCardsProps {
    stats: {
        leads: number;
        siteVisitsScheduled: number;
        freshLeads: number;
        bookedLeads: number;
    };
    loading: boolean;
}

const StatsCards = ({ stats, loading }: StatsCardsProps) => {
    const Card = ({ title, value, icon: Icon, color, subtitle, href }: any) => (
        <Link href={href} className="flex-shrink-0 w-64 md:w-auto">
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
        </Link>
    );

    return (
        <div className="flex gap-4 md:grid md:grid-cols-2 lg:grid-cols-4 md:gap-6 min-w-max md:min-w-0">
            <Card
                title="Total Leads"
                value={stats.leads}
                icon={Users}
                color="bg-blue-500"
                subtitle="Active pipeline"
                href="/leads"
            />
            <Card
                title="Total Site Visits"
                value={stats.siteVisitsScheduled}
                icon={Clock}
                color="bg-emerald-500"
                subtitle="Scheduled status"
                href="/site-visits"
            />
            <Card
                title="Fresh / New Leads"
                value={stats.freshLeads}
                icon={BarChart3}
                color="bg-violet-500"
                subtitle="New + Fresh Lead status"
                href="/leads"
            />
            <Card
                title="Booked Leads"
                value={stats.bookedLeads}
                icon={Target}
                color="bg-orange-500"
                subtitle="Deal Success status"
                href="/leads"
            />
        </div>
    );
};

export default StatsCards;
