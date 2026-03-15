import { Bar, BarChart, CartesianGrid, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Cell } from 'recharts';
import { useMemo, useState } from 'react';
import { Filter } from 'lucide-react';

interface DashboardPoint {
    date: string;
    totalLeads: number;
    siteVisitsScheduled: number;
    dealSuccess: number;
    bookingInProgress: number;
    followUpScheduled: number;
    junkLeads: number;
}

interface DateRange {
    from: string;
    to: string;
}

interface DashboardChartsProps {
    readonly chartData: DashboardPoint[];
    readonly loading?: boolean;
    dateRange: DateRange;
    setDateRange: (range: DateRange) => void;
}

const ChartCard = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-slate-800">{title}</h2>
        </div>
        <div className="h-[32rem]">{children}</div>
    </div>
);

export default function DashboardCharts({ chartData, loading, dateRange, setDateRange }: DashboardChartsProps) {
    const [filterOpen, setFilterOpen] = useState<null | 'pie' | 'bar'>(null);
    const hasData = chartData && chartData.length > 0;

    const totals = useMemo(() => {
        const totalLeads = chartData.reduce((sum, p) => sum + p.totalLeads, 0);
        const siteVisitsScheduled = chartData.reduce((sum, p) => sum + p.siteVisitsScheduled, 0);
        const dealSuccess = chartData.reduce((sum, p) => sum + p.dealSuccess, 0);
        const followUpScheduled = chartData.reduce((sum, p) => sum + p.followUpScheduled, 0);
        const junkLeads = chartData.reduce((sum, p) => sum + p.junkLeads, 0);

        // Each line is just two points: (0,0) and (1,value)
        const lineData = [
            { x: 0, totalLeads: 0, siteVisitsScheduled: 0, dealSuccess: 0 },
            { x: 1, totalLeads, siteVisitsScheduled, dealSuccess },
        ];

        return {
            totalLeads,
            siteVisitsScheduled,
            dealSuccess,
            followUpScheduled,
            junkLeads,
            lineData,
            barData: [
                { name: 'Total Leads', value: totalLeads, fill: '#6366F1' },
                { name: 'Follow-up Scheduled', value: followUpScheduled, fill: '#A855F7' },
                { name: 'Junk Leads', value: junkLeads, fill: '#64748B' },
            ],
        };
    }, [chartData]);

    const pieData = [
        { name: 'Total Leads', value: totals.totalLeads, fill: '#6366F1' },
        { name: 'Site Visits Scheduled', value: totals.siteVisitsScheduled, fill: '#F59E0B' },
        { name: 'Deal Success', value: totals.dealSuccess, fill: '#10B981' },
    ];

    const renderPieChart = () => {
        if (loading) {
            return <div className="h-full flex items-center justify-center text-slate-400">Loading...</div>;
        }
        if (!hasData) {
            return <div className="h-full flex items-center justify-center text-slate-400">No data to display.</div>;
        }
        return (
            <ResponsiveContainer width="100%" height="100%">
                <PieChart width={600} height={600}>
                    <Tooltip />
                    <Legend />
                    <Pie
                        data={pieData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={180}
                        label
                    >
                        {pieData.map((entry, idx) => (
                            <Cell key={`cell-${idx}`} fill={entry.fill} />
                        ))}
                    </Pie>
                </PieChart>
            </ResponsiveContainer>
        );
    };

    const renderBarChart = () => {
        if (loading) {
            return <div className="h-full flex items-center justify-center text-slate-400">Loading...</div>;
        }

        if (!hasData) {
            return <div className="h-full flex items-center justify-center text-slate-400">No data to display.</div>;
        }

        return (
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    data={totals.barData}
                    margin={{ top: 40, right: 32, left: 16, bottom: 16 }}
                    barCategoryGap={40}
                >
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis dataKey="name" tick={{ fontSize: 14 }} />
                    <YAxis allowDecimals={false} tick={{ fontSize: 14 }} />
                    <Tooltip />
                    <Legend />
                    <Bar
                        dataKey="value"
                        name="Count"
                        label={{ position: 'top', fill: '#334155', fontWeight: 700, fontSize: 18, dy: -8 }}
                        maxBarSize={80}
                        radius={[12, 12, 0, 0]}
                    />
                </BarChart>
            </ResponsiveContainer>
        );
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChartCard title="Leads vs Visits vs Booking">
                {renderPieChart()}
                <button
                    className="absolute bottom-4 right-4 bg-slate-100 hover:bg-slate-200 rounded-full p-2 shadow"
                    onClick={() => setFilterOpen('pie')}
                    aria-label="Filter Pie Chart"
                >
                    <Filter size={20} />
                </button>
                {filterOpen === 'pie' && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
                        <div className="bg-white rounded-xl p-6 shadow-lg min-w-[320px] relative">
                            <h3 className="text-lg font-semibold mb-4">Filter Data</h3>
                            <div className="flex flex-col gap-3 mb-4">
                                <div className="flex flex-col">
                                    <label htmlFor="pieDateFrom" className="text-xs font-medium text-slate-500 mb-1">From</label>
                                    <input
                                        id="pieDateFrom"
                                        type="date"
                                        value={dateRange.from}
                                        onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
                                        className="w-full p-2 border rounded-lg"
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label htmlFor="pieDateTo" className="text-xs font-medium text-slate-500 mb-1">To</label>
                                    <input
                                        id="pieDateTo"
                                        type="date"
                                        value={dateRange.to}
                                        onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
                                        className="w-full p-2 border rounded-lg"
                                    />
                                </div>
                            </div>
                            <div className="flex gap-2 mb-4">
                                <button
                                    onClick={() => setDateRange({
                                        from: (() => {
                                            const to = new Date();
                                            const from = new Date();
                                            from.setDate(to.getDate() - 6);
                                            return `${from.getFullYear()}-${String(from.getMonth() + 1).padStart(2, '0')}-${String(from.getDate()).padStart(2, '0')}`;
                                        })(),
                                        to: (() => {
                                            const to = new Date();
                                            return `${to.getFullYear()}-${String(to.getMonth() + 1).padStart(2, '0')}-${String(to.getDate()).padStart(2, '0')}`;
                                        })(),
                                    })}
                                    className="px-3 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200"
                                >
                                    Last 7 days
                                </button>
                                <button
                                    onClick={() => setDateRange({
                                        from: (() => {
                                            const to = new Date();
                                            const from = new Date();
                                            from.setDate(to.getDate() - 29);
                                            return `${from.getFullYear()}-${String(from.getMonth() + 1).padStart(2, '0')}-${String(from.getDate()).padStart(2, '0')}`;
                                        })(),
                                        to: (() => {
                                            const to = new Date();
                                            return `${to.getFullYear()}-${String(to.getMonth() + 1).padStart(2, '0')}-${String(to.getDate()).padStart(2, '0')}`;
                                        })(),
                                    })}
                                    className="px-3 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200"
                                >
                                    Last 30 days
                                </button>
                                <button
                                    onClick={() => setDateRange({ from: '', to: '' })}
                                    className="px-3 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200"
                                >
                                    All time
                                </button>
                            </div>
                            <button
                                className="absolute top-2 right-2 text-slate-400 hover:text-slate-600"
                                onClick={() => setFilterOpen(null)}
                                aria-label="Close filter"
                            >
                                ×
                            </button>
                        </div>
                    </div>
                )}
            </ChartCard>

            <ChartCard title="Leads vs Follow-ups vs Junk">
                {renderBarChart()}
                <button
                    className="absolute bottom-4 right-4 bg-slate-100 hover:bg-slate-200 rounded-full p-2 shadow"
                    onClick={() => setFilterOpen('bar')}
                    aria-label="Filter Bar Chart"
                >
                    <Filter size={20} />
                </button>
                {filterOpen === 'bar' && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
                        <div className="bg-white rounded-xl p-6 shadow-lg min-w-[320px] relative">
                            <h3 className="text-lg font-semibold mb-4">Filter Data</h3>
                            <div className="flex flex-col gap-3 mb-4">
                                <div className="flex flex-col">
                                    <label htmlFor="barDateFrom" className="text-xs font-medium text-slate-500 mb-1">From</label>
                                    <input
                                        id="barDateFrom"
                                        type="date"
                                        value={dateRange.from}
                                        onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
                                        className="w-full p-2 border rounded-lg"
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label htmlFor="barDateTo" className="text-xs font-medium text-slate-500 mb-1">To</label>
                                    <input
                                        id="barDateTo"
                                        type="date"
                                        value={dateRange.to}
                                        onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
                                        className="w-full p-2 border rounded-lg"
                                    />
                                </div>
                            </div>
                            <div className="flex gap-2 mb-4">
                                <button
                                    onClick={() => setDateRange({
                                        from: (() => {
                                            const to = new Date();
                                            const from = new Date();
                                            from.setDate(to.getDate() - 6);
                                            return `${from.getFullYear()}-${String(from.getMonth() + 1).padStart(2, '0')}-${String(from.getDate()).padStart(2, '0')}`;
                                        })(),
                                        to: (() => {
                                            const to = new Date();
                                            return `${to.getFullYear()}-${String(to.getMonth() + 1).padStart(2, '0')}-${String(to.getDate()).padStart(2, '0')}`;
                                        })(),
                                    })}
                                    className="px-3 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200"
                                >
                                    Last 7 days
                                </button>
                                <button
                                    onClick={() => setDateRange({
                                        from: (() => {
                                            const to = new Date();
                                            const from = new Date();
                                            from.setDate(to.getDate() - 29);
                                            return `${from.getFullYear()}-${String(from.getMonth() + 1).padStart(2, '0')}-${String(from.getDate()).padStart(2, '0')}`;
                                        })(),
                                        to: (() => {
                                            const to = new Date();
                                            return `${to.getFullYear()}-${String(to.getMonth() + 1).padStart(2, '0')}-${String(to.getDate()).padStart(2, '0')}`;
                                        })(),
                                    })}
                                    className="px-3 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200"
                                >
                                    Last 30 days
                                </button>
                                <button
                                    onClick={() => setDateRange({ from: '', to: '' })}
                                    className="px-3 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200"
                                >
                                    All time
                                </button>
                            </div>
                            <button
                                className="absolute top-2 right-2 text-slate-400 hover:text-slate-600"
                                onClick={() => setFilterOpen(null)}
                                aria-label="Close filter"
                            >
                                ×
                            </button>
                        </div>
                    </div>
                )}
            </ChartCard>
        </div>
    );
}

