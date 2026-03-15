import Link from 'next/link';
import { Users, Clock, Target, Building, UserPlus } from 'lucide-react';
import Spinner from '@/components/ui/Spinner';

interface StatsCardsProps {
    stats: {
        leads: number;
        siteVisitsScheduled: number;
        freshLeads: number;
        bookedLeads: number;
        bookingInProgress: number;
        followUpScheduled: number;
        junkLeads: number;
        projects: number;
    };
    loading: boolean;
}

const Card = ({ title, value, icon: Icon, color, subtitle, href, loading }: any) => (
    <Link href={href} className="w-full">
        <div className="h-full bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
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

const StatsCards = ({ stats, loading }: StatsCardsProps) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card
                title="Total Leads"
                value={stats.leads}
                icon={Users}
                color="bg-blue-500"
                subtitle="Active pipeline"
                href="/leads"
                loading={loading}
            />
            <Card
                title="New / Fresh Leads"
                value={stats.freshLeads}
                icon={UserPlus}
                color="bg-violet-500"
                subtitle="Recently added leads"
                href="/leads"
                loading={loading}
            />
            <Card
                title="Deal Success"
                value={stats.bookedLeads}
                icon={Target}
                color="bg-emerald-500"
                subtitle="Deals won"
                href="/leads"
                loading={loading}
            />
            <Card
                title="Booking in Progress"
                value={stats.bookingInProgress}
                icon={Target}
                color="bg-orange-500"
                subtitle="In progress"
                href="/leads"
                loading={loading}
            />
            <Card
                title="Junk Leads"
                value={stats.junkLeads}
                icon={Target}
                color="bg-slate-500"
                subtitle="Marked as junk"
                href="/leads"
                loading={loading}
            />
            <Card
                title="Follow-up Scheduled"
                value={stats.followUpScheduled}
                icon={Target}
                color="bg-purple-500"
                subtitle="Needs follow-up"
                href="/leads"
                loading={loading}
            />
            <Card
                title="Site Visits Scheduled"
                value={stats.siteVisitsScheduled}
                icon={Clock}
                color="bg-indigo-500"
                subtitle="Upcoming visits"
                href="/site-visits"
                loading={loading}
            />
            <Card
                title="Projects"
                value={stats.projects}
                icon={Building}
                color="bg-sky-500"
                subtitle="Listed projects"
                href="/projects"
                loading={loading}
            />
        </div>
    );
};

export default StatsCards;
