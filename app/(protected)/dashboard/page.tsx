'use client';

import { useEffect, useMemo, useState } from 'react';
import { APP_NAME } from '@/lib/config';
import StatsCards from '@/components/dashboard/StatsCards';
import DashboardCharts from '@/components/dashboard/DashboardCharts';
import RealEstateUpdates from '@/components/dashboard/RealEstateUpdates';
import QuickActions from '@/components/dashboard/QuickActions';

type Lead = { status?: string; createdAt?: string; isJunk?: boolean };
type SiteVisit = { status?: string; createdAt?: string };

type StatsState = {
  leads: number;
  siteVisitsScheduled: number;
  freshLeads: number;
  bookedLeads: number;
  bookingInProgress: number;
  followUpScheduled: number;
  junkLeads: number;
  projects: number;
};

type DashboardPoint = {
  date: string;
  totalLeads: number;
  siteVisitsScheduled: number;
  bookingInProgress: number;
  followUpScheduled: number;
  junkLeads: number;
};

type DateRange = {
  from: string; // YYYY-MM-DD or empty (no filter)
  to: string; // YYYY-MM-DD or empty (no filter)
};

const formatDateKey = (date: Date) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const isValidDateString = (value: string) => {
  const date = new Date(value);
  return value !== '' && !Number.isNaN(date.getTime());
};

const getFullDateRangeFromData = (leads: Lead[], visits: SiteVisit[]): DateRange | null => {
  const dateStrings = [
    ...leads.map((l) => l.createdAt).filter(Boolean) as string[],
    ...visits.map((v) => v.createdAt).filter(Boolean) as string[],
  ];

  if (dateStrings.length === 0) return null;

  const dates = dateStrings
    .map((d) => new Date(d))
    .filter((d) => !Number.isNaN(d.getTime()));

  if (dates.length === 0) return null;

  const sorted = dates.sort((a, b) => a.getTime() - b.getTime());
  return {
    from: formatDateKey(sorted[0]),
    to: formatDateKey(sorted[sorted.length - 1]),
  };
};

const getDateKeysBetween = (from: string, to: string) => {
  const start = new Date(from);
  const end = new Date(to);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return [];
  const keys: string[] = [];
  const cursor = new Date(start);
  while (cursor <= end) {
    keys.push(formatDateKey(cursor));
    cursor.setDate(cursor.getDate() + 1);
  }
  return keys;
};

const getDefaultDateRange = (days = 7): DateRange => {
  const to = new Date();
  const from = new Date();
  from.setDate(to.getDate() - (days - 1));
  const toIso = formatDateKey(to);
  const fromIso = formatDateKey(from);
  return { from: fromIso, to: toIso };
};

const createDayMap = (keys: string[]) => {
  const map: Record<string, number> = {};
  keys.forEach((key) => {
    map[key] = 0;
  });
  return map;
};

export default function DashboardPage() {
  const [stats, setStats] = useState<StatsState>({
    leads: 0,
    siteVisitsScheduled: 0,
    freshLeads: 0,
    bookedLeads: 0,
    bookingInProgress: 0,
    followUpScheduled: 0,
    junkLeads: 0,
    projects: 0,
  });

  const [rawLeads, setRawLeads] = useState<Lead[]>([]);
  const [rawSiteVisits, setRawSiteVisits] = useState<SiteVisit[]>([]);

  const [dateRange, setDateRange] = useState<DateRange>({ from: '', to: '' });

  // Compute filtered stats for cards using dateRange
  const filteredStats = useMemo(() => {
    // If no filter, show all
    if (!dateRange.from || !dateRange.to) {
      return stats;
    }
    const fromDate = new Date(dateRange.from);
    const toDate = new Date(dateRange.to);
    const inRange = (d?: string) => {
      if (!d) return false;
      const dt = new Date(d);
      // Set time to 00:00:00 for fromDate and 23:59:59 for toDate for inclusive filtering
      const from = new Date(fromDate);
      from.setHours(0, 0, 0, 0);
      const to = new Date(toDate);
      to.setHours(23, 59, 59, 999);
      return dt >= from && dt <= to;
    };
    // Only leads created within the range are considered for all stats
    const leadsInRange = rawLeads.filter((l) => inRange(l.createdAt));
    const siteVisitsInRange = rawSiteVisits.filter((v) => inRange(v.createdAt));
    return {
      leads: leadsInRange.length,
      siteVisitsScheduled: siteVisitsInRange.filter((v) => v.status === 'Scheduled').length,
      freshLeads: leadsInRange.filter((l) => l.status === 'New / Fresh Lead').length,
      bookedLeads: leadsInRange.filter((l) => l.status === 'Deal Success').length,
      bookingInProgress: leadsInRange.filter((l) => l.status === 'Booking in Progress').length,
      followUpScheduled: leadsInRange.filter((l) => l.status === 'Follow-Up Scheduled').length,
      junkLeads: leadsInRange.filter((l) => l.isJunk).length,
      projects: stats.projects, // Projects are not date filtered
    };
  }, [dateRange, rawLeads, rawSiteVisits, stats]);

  // ...existing code...
  const chartData = useMemo(() => {
    const keys = (() => {
      if (isValidDateString(dateRange.from) && isValidDateString(dateRange.to)) {
        return getDateKeysBetween(dateRange.from, dateRange.to);
      }

      const fullRange = getFullDateRangeFromData(rawLeads, rawSiteVisits);
      if (!fullRange) return [];
      return getDateKeysBetween(fullRange.from, fullRange.to);
    })();
    const totalLeadsByDay = createDayMap(keys);
    const dealSuccessByDay = createDayMap(keys);
    const bookingByDay = createDayMap(keys);
    const followupsByDay = createDayMap(keys);
    const junkByDay = createDayMap(keys);
    const visitsByDay = createDayMap(keys);

    rawLeads.forEach((lead) => {
      if (!lead.createdAt) return;
      const key = formatDateKey(new Date(lead.createdAt));
      if (!Object.hasOwn(totalLeadsByDay, key)) return;
      totalLeadsByDay[key] += 1;
      if (lead.status === 'Deal Success') dealSuccessByDay[key] += 1;
      if (lead.status === 'Booking in Progress') bookingByDay[key] += 1;
      if (lead.status === 'Follow-Up Scheduled') followupsByDay[key] += 1;
      if (lead.isJunk) junkByDay[key] += 1;
    });

    rawSiteVisits.forEach((visit) => {
      if (!visit.createdAt) return;
      const key = formatDateKey(new Date(visit.createdAt));
      if (!Object.hasOwn(visitsByDay, key)) return;
      if (visit.status === 'Scheduled') visitsByDay[key] += 1;
    });

    return keys.map((date) => ({
      date,
      totalLeads: totalLeadsByDay[date] ?? 0,
      siteVisitsScheduled: visitsByDay[date] ?? 0,
      dealSuccess: dealSuccessByDay[date] ?? 0,
      bookingInProgress: bookingByDay[date] ?? 0,
      followUpScheduled: followupsByDay[date] ?? 0,
      junkLeads: junkByDay[date] ?? 0,
    }));
  }, [dateRange, rawLeads, rawSiteVisits]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      setLoading(true);
      try {
        const [leadsRes, siteVisitsRes, projectsRes] = await Promise.all([
          fetch('/api/leads'),
          fetch('/api/site-visits'),
          fetch('/api/projects'),
        ]);

        const [leads, siteVisits, projects] = await Promise.all([
          leadsRes.ok ? leadsRes.json() : [],
          siteVisitsRes.ok ? siteVisitsRes.json() : [],
          projectsRes.ok ? projectsRes.json() : [],
        ]);

        setRawLeads(Array.isArray(leads) ? leads : []);
        setRawSiteVisits(Array.isArray(siteVisits) ? siteVisits : []);

        const totalLeads = Array.isArray(leads) ? leads.length : 0;
        const freshLeads = Array.isArray(leads)
          ? leads.filter((l: Lead) => l.status === 'New / Fresh Lead').length
          : 0;
        const bookedLeads = Array.isArray(leads)
          ? leads.filter((l: Lead) => l.status === 'Deal Success').length
          : 0;
        const bookingInProgress = Array.isArray(leads)
          ? leads.filter((l: Lead) => l.status === 'Booking in Progress').length
          : 0;
        const followUpScheduled = Array.isArray(leads)
          ? leads.filter((l: Lead) => l.status === 'Follow-Up Scheduled').length
          : 0;
        const junkLeads = Array.isArray(leads)
          ? leads.filter((l: Lead) => l.isJunk).length
          : 0;

        const siteVisitsScheduled = Array.isArray(siteVisits)
          ? siteVisits.filter((v: SiteVisit) => v.status === 'Scheduled').length
          : 0;

        setStats({
          leads: totalLeads,
          siteVisitsScheduled,
          freshLeads,
          bookedLeads,
          bookingInProgress,
          followUpScheduled,
          junkLeads,
          projects: Array.isArray(projects) ? projects.length : 0,
        });
      } catch (error) {
        console.error('Dashboard data load failed', error);
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
        <p className="text-slate-500">Welcome back to {APP_NAME}</p>
      </div>

      {/* Stats Cards Section */}
      <StatsCards stats={filteredStats} loading={loading} />



      {/* Charts */}
      <DashboardCharts chartData={chartData} loading={loading} dateRange={dateRange} setDateRange={setDateRange} />

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
