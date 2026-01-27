import { cn } from '@/lib/utils';

interface BadgeProps {
    status: string;
}

export default function Badge({ status }: BadgeProps) {
    const getStatusColor = (status: string) => {
        if (status.includes('New') || status.includes('Fresh')) return 'bg-blue-100 text-blue-800 border-blue-200';
        if (status.includes('Contacted') || status.includes('Attempted')) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
        if (status.includes('Interested') || status.includes('Warm')) return 'bg-amber-100 text-amber-800 border-amber-200';
        if (status.includes('Not Interested')) return 'bg-red-100 text-red-800 border-red-200';
        if (status.includes('No Response')) return 'bg-gray-100 text-gray-800 border-gray-200';
        if (status.includes('Follow-Up') || status.includes('Scheduled')) return 'bg-purple-100 text-purple-800 border-purple-200';
        if (status.includes('Booking') || status.includes('Progress')) return 'bg-orange-100 text-orange-800 border-orange-200';
        if (status.includes('Success') || status.includes('Won')) return 'bg-green-100 text-green-800 border-green-200';
        if (status.includes('Lost')) return 'bg-red-100 text-red-800 border-red-200';
        if (status.includes('Other')) return 'bg-slate-100 text-slate-800 border-slate-200';
        return 'bg-slate-100 text-slate-800 border-slate-200';
    };

    return (
        <span className={cn("inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border", getStatusColor(status))}>
            {status}
        </span>
    );
}