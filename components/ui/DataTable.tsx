
'use client';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import Spinner from './Spinner';

interface DataTableProps {
    readonly columns: any[];
    readonly data: any[];
    readonly selectedIds: Set<string>;
    readonly onSelectionChange: (ids: Set<string>) => void;
    readonly onRowClick?: (item: any) => void;
    readonly isLoading?: boolean;
    readonly actionBuilder?: (item: any) => React.ReactNode;
}

export default function DataTable({ columns, data, selectedIds, onSelectionChange, onRowClick, isLoading, actionBuilder }: DataTableProps) {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const totalPages = Math.ceil(data.length / itemsPerPage);
    const paginatedData = data.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const getPageNumbers = () => {
        const pages = [];
        if (totalPages <= 7) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            pages.push(1);
            if (currentPage > 4) pages.push('...');
            const start = Math.max(2, currentPage - 1);
            const end = Math.min(totalPages - 1, currentPage + 1);
            for (let i = start; i <= end; i++) pages.push(i);
            if (currentPage < totalPages - 3) pages.push('...');
            pages.push(totalPages);
        }
        return pages;
    };

    const handleSelectAll = () => {
        if (selectedIds.size === data.length && data.length > 0) onSelectionChange(new Set());
        else onSelectionChange(new Set(data.map((i: any) => i._id)));
    };

    const handleSelectRow = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        const newSet = new Set(selectedIds);
        if (newSet.has(id)) newSet.delete(id); else newSet.add(id);
        onSelectionChange(newSet);
    };

    return (
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col min-h-[500px]">
            <div className="flex-1 overflow-x-auto relative">
                {isLoading && <div className="absolute inset-0 bg-white/80 z-10 flex items-center justify-center"><Spinner size={32} className="text-indigo-600" /></div>}
                <div className="min-w-full inline-block align-middle">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-100 text-xs font-bold text-slate-500 uppercase tracking-wider">
                                <th className="p-4 w-14 sticky left-0 bg-slate-50 z-10">
                                    <div className="flex items-center justify-center">
                                        <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer" checked={data.length > 0 && selectedIds.size === data.length} onChange={handleSelectAll} disabled={data.length === 0} />
                                    </div>
                                </th>
                                {columns.map((col: any) => (
                                    <th key={col.key} className={cn("p-4 whitespace-nowrap", col.className)}>{col.header}</th>
                                ))}
                                <th className="p-4 text-right w-32 bg-slate-50 z-5">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {paginatedData.map((row: any) => (
                                <tr key={row._id} onClick={() => onRowClick?.(row)} className={cn("hover:bg-slate-50 transition-colors cursor-pointer group", selectedIds.has(row._id) && "bg-indigo-50/40")}>
                                    <td className="p-4 sticky left-0 bg-white z-10 group-hover:bg-slate-50" onClick={(e) => handleSelectRow(row._id, e)}>
                                        <div className="flex items-center justify-center w-full h-full cursor-pointer p-2 -m-2">
                                            <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 pointer-events-none" checked={selectedIds.has(row._id)} readOnly />
                                        </div>
                                    </td>
                                    {columns.map((col: any) => (
                                        <td key={col.key} className="p-4 text-sm text-slate-600">{col.render ? col.render(row) : row[col.key]}</td>
                                    ))}
                                    <td className="p-4 text-right w-32 bg-white z-5 group-hover:bg-slate-50" onClick={e => e.stopPropagation()}>{actionBuilder?.(row)}</td>
                                </tr>
                            ))}
                            {data.length === 0 && !isLoading && <tr><td colSpan={columns.length + 2} className="p-12 text-center text-slate-500">No records found</td></tr>}
                        </tbody>
                    </table>
                </div>
            </div>
            <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex justify-between items-center text-sm text-slate-500">
                <span>Showing {data.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, data.length)} of {data.length} entries</span>
                <div className="flex gap-2">
                    <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="px-3 py-2 border rounded-lg hover:bg-white disabled:opacity-50 text-sm">Previous</button>
                    {getPageNumbers().map((page, index) => {
                        if (page === '...') {
                            return <span key={`ellipsis-${currentPage}-${index}`} className="px-3 py-2">...</span>;
                        } else {
                            return <button key={page} onClick={() => setCurrentPage(page as number)} className={cn("px-3 py-2 border rounded-lg hover:bg-white text-sm", currentPage === page && "bg-indigo-600 text-white")}>
                                {page}
                            </button>;
                        }
                    })}
                    <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages || totalPages === 0} className="px-3 py-2 border rounded-lg hover:bg-white disabled:opacity-50 text-sm">Next</button>
                </div>
            </div>
        </div>
    );
}
