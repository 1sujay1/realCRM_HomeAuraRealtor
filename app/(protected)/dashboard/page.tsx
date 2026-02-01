'use client';
import { useEffect, useState } from 'react';
import { APP_NAME } from '@/lib/config';
import StatsCards from '@/components/dashboard/StatsCards';
import ScrollableCards from '@/components/dashboard/ScrollableCards';
import RealEstateUpdates from '@/components/dashboard/RealEstateUpdates';
import QuickActions from '@/components/dashboard/QuickActions';

export default function DashboardPage() {
  const [stats, setStats] = useState({
    leads: 0,
    siteVisitsScheduled: 0,
    projects: 0,
    bookedLeads: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/leads').then(res => res.ok ? res.json() : []),
      fetch('/api/site-visits?status=Scheduled').then(res => res.ok ? res.json() : []),
      fetch('/api/projects').then(res => res.ok ? res.json() : []),
      fetch('/api/leads?status=Deal%20Success').then(res => res.ok ? res.json() : [])
    ]).then(([leads, scheduledSiteVisits, projects, bookedLeads]) => {
      setStats({
        leads: leads.length,
        siteVisitsScheduled: scheduledSiteVisits.length,
        projects: projects.length,
        bookedLeads: bookedLeads.length
      });
    }).finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
        <p className="text-slate-500">Welcome back to {APP_NAME}</p>
      </div>

      {/* Stats Cards Section */}
      <ScrollableCards>
        <StatsCards stats={stats} loading={loading} />
      </ScrollableCards>

      {/* Real Estate Updates & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RealEstateUpdates />
        </div>
        <QuickActions />
      </div>
    </div>
  );
}