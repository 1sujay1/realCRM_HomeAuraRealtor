
'use client';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Drawer({ isOpen, onClose, title, children }: any) {
  return (
    <>
      <div className={cn("fixed inset-0 bg-black/40 backdrop-blur-sm z-[55] transition-opacity duration-300", isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none")} onClick={onClose} />
      <div className={cn("fixed top-0 mt-0 right-0 h-screen z-[60] w-full max-w-xl bg-white shadow-2xl transform transition-transform duration-300 ease-in-out", isOpen ? "translate-x-0" : "translate-x-full")}>
        <div className="h-full flex flex-col">
          <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50">
            <h2 className="text-lg font-bold text-slate-800">{title}</h2>
            <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full text-slate-500 transition-colors"><X size={20} /></button>
          </div>
          {/* Removed space-y-6 to fix top margin issue */}
          <div className="flex-1 overflow-y-auto p-6">{children}</div>
        </div>
      </div>
    </>
  );
}
