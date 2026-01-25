'use client';
import { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import { Menu } from 'lucide-react';
import { APP_NAME } from '@/lib/config';
import Spinner from '@/components/ui/Spinner';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isDesktopCollapsed, setIsDesktopCollapsed] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => { if(data.user) setUser(data.user); else window.location.href = '/'; })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="h-screen flex flex-col items-center justify-center bg-slate-50 text-indigo-600 gap-2"><Spinner size={40} /><p className="text-sm font-medium">Loading {APP_NAME}...</p></div>;
  if (!user) return null;

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900">
      <Sidebar user={user} isMobileOpen={isMobileOpen} setIsMobileOpen={setIsMobileOpen} isDesktopCollapsed={isDesktopCollapsed} setIsDesktopCollapsed={setIsDesktopCollapsed} />
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <header className="lg:hidden h-16 bg-white border-b border-slate-100 flex items-center px-4 justify-between z-40 shadow-sm flex-shrink-0">
           <button onClick={() => setIsMobileOpen(true)} className="p-2 -ml-2 text-slate-600 hover:bg-slate-50 rounded-lg"><Menu size={24} /></button>
           <span className="font-bold text-lg text-indigo-900">{APP_NAME}</span>
           <div className="w-8"></div> 
        </header>
        <div className="flex-1 overflow-y-auto p-4 lg:p-8 scroll-smooth">{children}</div>
      </main>
    </div>
  );
}