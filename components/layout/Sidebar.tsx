'use client';
import { LayoutDashboard, Users, User, LogOut, Building, DollarSign, Lock, ChevronLeft, ChevronRight, MapPin, Home, BarChart3 } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { cn } from '@/lib/utils';
import { APP_NAME } from '@/lib/config';

export default function Sidebar({ user, isMobileOpen, setIsMobileOpen, isDesktopCollapsed, setIsDesktopCollapsed }: any) {
  const pathname = usePathname();
  const handleLogout = async () => {
    await signOut({ redirect: true, callbackUrl: window.location.origin });
  };
  const NavItem = ({ href, icon: Icon, label }: any) => {
    const isActive = pathname === href;
    return (
      <Link href={href} onClick={() => setIsMobileOpen(false)}
        className={cn("flex items-center space-x-4 px-6 py-5 rounded-xl transition-all duration-200 group relative text-lg", isActive ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200" : "text-slate-600 hover:bg-slate-100", isDesktopCollapsed && "justify-center px-3 space-x-0")}
        title={isDesktopCollapsed ? label : undefined}>
        <Icon size={26} className={isActive ? "text-white" : "text-slate-500 group-hover:text-indigo-600"} />
        {!isDesktopCollapsed && <span className="font-semibold text-base">{label}</span>}
      </Link>
    );
  };
  return (
    <>
      {isMobileOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm transition-opacity" onClick={() => setIsMobileOpen(false)} />}
      <aside className={cn("fixed lg:static inset-y-0 left-0 bg-white border-r border-slate-100 z-50 transform transition-all duration-300 ease-in-out flex flex-col shadow-xl lg:shadow-none no-print", isMobileOpen ? 'translate-x-0 w-72' : '-translate-x-full lg:translate-x-0', isDesktopCollapsed ? 'lg:w-28' : 'lg:w-[420px]')}>
        <div className={cn("p-6 flex items-center justify-between", isDesktopCollapsed && "flex-col gap-4 p-4")}>
          <div className="flex items-center gap-3 text-indigo-600">
            <div className="p-2.5 bg-indigo-100 rounded-lg"><Building size={32} /></div>
            {!isDesktopCollapsed && (<div><h1 className="text-3xl font-bold tracking-tight text-slate-800">{APP_NAME}</h1><p className="text-sm text-slate-400 font-bold uppercase tracking-wider">Pro Dashboard</p></div>)}
          </div>
          <button onClick={() => setIsDesktopCollapsed(!isDesktopCollapsed)} className="hidden lg:flex p-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-400">
            {isDesktopCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
        </div>
        <nav className="flex-1 px-4 space-y-2 overflow-y-auto mt-4">
          {!isDesktopCollapsed && <p className="px-4 text-sm font-bold text-slate-500 uppercase mb-4 tracking-wider">Main</p>}
          <NavItem href="/dashboard" icon={LayoutDashboard} label="Dashboard" />
          <NavItem href="/leads" icon={Users} label="Leads" />
          <NavItem href="/site-visits" icon={MapPin} label="Site Visits" />
          <NavItem href="/projects" icon={Home} label="Projects" /> {/* Added Projects link */}

          {user?.role === 'admin' && (
            <div className={cn(!isDesktopCollapsed && "pt-6 mt-2")}>
              {!isDesktopCollapsed && <p className="px-4 text-sm font-bold text-slate-400 uppercase mb-3 tracking-wider">Admin</p>}
              <NavItem href="/users" icon={Lock} label="User Management" />
              <NavItem href="/expense-dashboard" icon={BarChart3} label="Expense Dashboard" />
              <NavItem href="/expenses" icon={DollarSign} label="Expenses" />
            </div>
          )}
          <div className={cn(!isDesktopCollapsed && "pt-6 mt-2")}><NavItem href="/profile" icon={User} label="My Profile" /></div>
        </nav>
        <div className="p-5 border-t border-slate-100 bg-slate-50/50">
          <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 p-4 text-base font-medium text-red-600 hover:bg-red-50 rounded-xl transition-colors border border-transparent hover:border-red-100"><LogOut size={20} /> {!isDesktopCollapsed && "Sign Out"}</button>
        </div>
      </aside>
    </>
  );
}