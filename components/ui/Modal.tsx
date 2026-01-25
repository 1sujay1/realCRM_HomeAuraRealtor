
'use client';
import { X, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Modal({ isOpen, onClose, title, children, type = 'default' }: any) {
  if (!isOpen) return null;
  const isDanger = type === 'danger';
  
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className={cn("bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden transform transition-all scale-100", isDanger && "border-t-4 border-red-500")}>
        <div className="flex justify-between items-center p-4 border-b border-slate-100 bg-slate-50">
          <h3 className={cn("font-semibold flex items-center gap-2", isDanger ? "text-red-600" : "text-slate-800")}>
            {isDanger && <AlertTriangle size={18} />}
            {title}
          </h3>
          <button onClick={onClose} className="p-1 hover:bg-slate-200 rounded-full text-slate-500 transition-colors">
            <X size={20} />
          </button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
}
