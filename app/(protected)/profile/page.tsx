'use client';
import { useSession } from 'next-auth/react';
import { User, Shield, Mail } from 'lucide-react';
import Spinner from '@/components/ui/Spinner';

export default function ProfilePage() {
   const { data: session, status } = useSession();

   if (status === 'loading') return <div className="flex justify-center p-12"><Spinner size={40} className="text-indigo-600" /></div>;
   if (!session?.user) return <div>Error loading profile</div>;

   return (
      <div className="max-w-2xl mx-auto space-y-6">
         <h1 className="text-2xl font-bold text-slate-800">My Profile</h1>
         <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 text-center">
            <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4 text-indigo-600"><User size={40} /></div>
            <h2 className="text-2xl font-bold text-slate-800">{session.user.name}</h2>
            <p className="text-slate-500">{session.user.email}</p>
            <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-full text-sm font-medium text-slate-700 capitalize"><Shield size={14} /> {session.user.role}</div>
         </div>
         <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="font-semibold text-lg mb-4">Account Details</h3>
            <div className="space-y-4">
               <div className="flex items-center gap-4 p-3 border rounded-lg"><Mail className="text-slate-400" /><div><p className="text-xs text-slate-500 uppercase">Email</p><p className="font-medium">{session.user.email}</p></div></div>
               <div className="flex items-center gap-4 p-3 border rounded-lg"><Shield className="text-slate-400" /><div><p className="text-xs text-slate-500 uppercase">Verification Status</p><p className={session.user.isVerified ? "text-green-600 font-medium" : "text-amber-600 font-medium"}>{session.user.isVerified ? "Verified Account" : "Verification Pending"}</p></div></div>
            </div>
         </div>
      </div>
   );
}