'use client';

import { useEffect, useMemo, useState } from 'react';
import { useSession } from 'next-auth/react';
import { BarChart3, Calendar, Filter } from 'lucide-react';
import { cn } from '@/lib/utils';
import Spinner from '@/components/ui/Spinner';

type ExpenseEntry = {
    _id: string;
    amount?: string | number;
    expenseType?: string;
    date?: string | Date;
};

export default function ExpenseDashboardPage() {
    const { data: session, status } = useSession();
    const canViewExpenses = session?.user?.permissions?.canViewExpenses;

    const [expenses, setExpenses] = useState<ExpenseEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');

    useEffect(() => {
        if (status === 'loading') return;
        if (!canViewExpenses) {
            setLoading(false);
            return;
        }

        const fetchExpenses = async () => {
            try {
                setLoading(true);
                setError(null);
                const res = await fetch('/api/expenses');
                if (!res.ok) {
                    throw new Error('Failed to fetch expenses');
                }
                const data = await res.json();
                setExpenses(Array.isArray(data) ? data : []);
            } catch (err) {
                setError('Failed to load expenses dashboard.');
            } finally {
                setLoading(false);
            }
        };

        fetchExpenses();
    }, [canViewExpenses, status]);

    const filteredExpenses = useMemo(() => {
        const start = fromDate ? new Date(fromDate) : null;
        const end = toDate ? new Date(toDate) : null;
        if (start) start.setHours(0, 0, 0, 0);
        if (end) end.setHours(23, 59, 59, 999);

        return (Array.isArray(expenses) ? expenses : []).filter((item) => {
            const itemDate = item.date ? new Date(item.date) : null;
            if (!itemDate) return false;
            if (start && itemDate < start) return false;
            if (end && itemDate > end) return false;
            return true;
        });
    }, [expenses, fromDate, toDate]);

    const totals = useMemo(() => {
        const categories = ['Rent', 'Travel', 'Food', 'Salary', 'Ads', 'Other'];
        const result: Record<string, number> = {};
        let total = 0;

        categories.forEach((cat) => {
            const sum = filteredExpenses
                .filter((d) => d.expenseType === cat)
                .reduce((a, b) => a + Number(b.amount || 0), 0);
            result[cat] = sum;
            total += sum;
        });

        result.Total = total;
        return result;
    }, [filteredExpenses]);

    const grandTotal = useMemo(() => {
        return (Array.isArray(expenses) ? expenses : []).reduce((sum, d) => sum + Number(d.amount || 0), 0);
    }, [expenses]);

    const colors: Record<string, string> = {
        Rent: '#7dd3fc',
        Travel: '#6ee7b7',
        Food: '#fca5a5',
        Salary: '#fbbf24',
        Ads: '#fcd34d',
        Other: '#d8b4fe',
        Total: '#6366f1',
        GrandTotal: '#10ac84',
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <Spinner size={40} className="text-indigo-600" />
            </div>
        );
    }

    if (!canViewExpenses) {
        return (
            <div className="bg-white p-6 rounded-xl border border-slate-200 text-slate-600">
                You do not have permission to view the Expense Dashboard.
            </div>
        );
    }

    return (
        <div className="space-y-6 p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                        <BarChart3 size={22} /> Expense Dashboard
                    </h1>
                    <p className="text-slate-500 text-sm">Track spending by category and date range.</p>
                </div>
            </div>

            {error && (
                <div className="p-4 bg-red-50 text-red-700 rounded-lg">
                    {error}
                </div>
            )}

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-wrap gap-4 items-center">
                <div className="flex items-center gap-2 text-slate-600">
                    <Filter size={18} />
                    <span className="text-sm font-semibold">Filters</span>
                </div>
                <div className="flex items-center gap-2">
                    <Calendar size={16} className="text-slate-400" />
                    <input
                        type="date"
                        value={fromDate}
                        onChange={(e) => setFromDate(e.target.value)}
                        className="border border-slate-200 rounded-lg px-3 py-2 text-sm"
                    />
                </div>
                <span className="text-slate-400 text-sm">to</span>
                <div className="flex items-center gap-2">
                    <Calendar size={16} className="text-slate-400" />
                    <input
                        type="date"
                        value={toDate}
                        onChange={(e) => setToDate(e.target.value)}
                        className="border border-slate-200 rounded-lg px-3 py-2 text-sm"
                    />
                </div>
                <button
                    onClick={() => { setFromDate(''); setToDate(''); }}
                    className="text-sm text-slate-500 hover:text-slate-700 underline"
                >
                    Reset
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {Object.entries(totals).map(([key, value]) => (
                    <div
                        key={key}
                        className={cn(
                            'rounded-xl p-5 text-white shadow-md transition-transform',
                            'hover:-translate-y-1'
                        )}
                        style={{ background: colors[key] || '#888' }}
                    >
                        <div className="text-sm font-semibold">
                            {key === 'Total' ? 'Total (Filtered)' : key}
                        </div>
                        <div className="text-2xl font-bold mt-2">₹{value.toLocaleString()}</div>
                    </div>
                ))}

                <div
                    className="rounded-xl p-5 text-white shadow-md transition-transform hover:-translate-y-1"
                    style={{ background: 'linear-gradient(135deg, #10ac84 0%, #222 100%)' }}
                >
                    <div className="text-sm font-semibold">Grand Total (All Time)</div>
                    <div className="text-2xl font-bold mt-2">₹{grandTotal.toLocaleString()}</div>
                </div>
            </div>
        </div>
    );
}
