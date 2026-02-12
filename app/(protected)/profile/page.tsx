'use client';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { User, Shield, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import Spinner from '@/components/ui/Spinner';
import Modal from '@/components/ui/Modal';

export default function ProfilePage() {
   const { data: session, status } = useSession();
   const [currentPassword, setCurrentPassword] = useState('');
   const [newPassword, setNewPassword] = useState('');
   const [confirmPassword, setConfirmPassword] = useState('');
   const [isSubmitting, setIsSubmitting] = useState(false);
   const [error, setError] = useState<string | null>(null);
   const [success, setSuccess] = useState<string | null>(null);
   const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
   const [showCurrentPassword, setShowCurrentPassword] = useState(false);
   const [showNewPassword, setShowNewPassword] = useState(false);
   const [showConfirmPassword, setShowConfirmPassword] = useState(false);

   const handleChangePassword = async (e: React.FormEvent) => {
      e.preventDefault();
      setError(null);
      setSuccess(null);

      if (!currentPassword || !newPassword || !confirmPassword) {
         setError('Please fill in all password fields.');
         return;
      }

      if (newPassword !== confirmPassword) {
         setError('New password and confirmation do not match.');
         return;
      }

      if (newPassword.length < 6) {
         setError('New password must be at least 6 characters.');
         return;
      }

      try {
         setIsSubmitting(true);
         const res = await fetch('/api/auth/change-password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ currentPassword, newPassword })
         });
         const data = await res.json();
         if (!res.ok) {
            setError(data?.error || 'Failed to change password.');
            return;
         }

         setSuccess('Password updated successfully.');
         setCurrentPassword('');
         setNewPassword('');
         setConfirmPassword('');
         setIsPasswordModalOpen(false);
      } catch (err) {
         setError('Failed to change password.');
      } finally {
         setIsSubmitting(false);
      }
   };

   const openPasswordModal = () => {
      setError(null);
      setSuccess(null);
      setIsPasswordModalOpen(true);
   };

   const closePasswordModal = () => {
      if (isSubmitting) return;
      setError(null);
      setSuccess(null);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setShowCurrentPassword(false);
      setShowNewPassword(false);
      setShowConfirmPassword(false);
      setIsPasswordModalOpen(false);
   };

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

         <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="font-semibold text-lg mb-2">Security</h3>
            <p className="text-sm text-slate-500 mb-4">Update your password anytime.</p>
            <button
               type="button"
               onClick={openPasswordModal}
               className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700"
            >
               Change / Reset Password
            </button>
         </div>
         <Modal
            isOpen={isPasswordModalOpen}
            onClose={closePasswordModal}
            title="Change Password"
         >
            <form onSubmit={handleChangePassword} className="space-y-4">
               <div>
                  <label className="text-sm font-medium text-slate-600">Current Password</label>
                  <div className="mt-1 flex items-center gap-2 border rounded-lg px-3 py-2">
                     <Lock className="text-slate-400" size={18} />
                     <input
                        type={showCurrentPassword ? 'text' : 'password'}
                        className="w-full outline-none text-slate-700"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        autoComplete="current-password"
                     />
                     <button
                        type="button"
                        onClick={() => setShowCurrentPassword((prev) => !prev)}
                        className="text-slate-400 hover:text-slate-600"
                        aria-label={showCurrentPassword ? 'Hide password' : 'Show password'}
                     >
                        {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                     </button>
                  </div>
               </div>
               <div>
                  <label className="text-sm font-medium text-slate-600">New Password</label>
                  <div className="mt-1 flex items-center gap-2 border rounded-lg px-3 py-2">
                     <Lock className="text-slate-400" size={18} />
                     <input
                        type={showNewPassword ? 'text' : 'password'}
                        className="w-full outline-none text-slate-700"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        autoComplete="new-password"
                     />
                     <button
                        type="button"
                        onClick={() => setShowNewPassword((prev) => !prev)}
                        className="text-slate-400 hover:text-slate-600"
                        aria-label={showNewPassword ? 'Hide password' : 'Show password'}
                     >
                        {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                     </button>
                  </div>
               </div>
               <div>
                  <label className="text-sm font-medium text-slate-600">Confirm New Password</label>
                  <div className="mt-1 flex items-center gap-2 border rounded-lg px-3 py-2">
                     <Lock className="text-slate-400" size={18} />
                     <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        className="w-full outline-none text-slate-700"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        autoComplete="new-password"
                     />
                     <button
                        type="button"
                        onClick={() => setShowConfirmPassword((prev) => !prev)}
                        className="text-slate-400 hover:text-slate-600"
                        aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                     >
                        {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                     </button>
                  </div>
               </div>

               {error && <p className="text-sm text-red-600">{error}</p>}
               {success && <p className="text-sm text-green-600">{success}</p>}

               <div className="flex items-center justify-end gap-2">
                  <button
                     type="button"
                     onClick={closePasswordModal}
                     disabled={isSubmitting}
                     className="px-4 py-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 disabled:opacity-60"
                  >
                     Cancel
                  </button>
                  <button
                     type="submit"
                     disabled={isSubmitting}
                     className="px-4 py-2 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 disabled:opacity-60"
                  >
                     {isSubmitting ? 'Updating...' : 'Update Password'}
                  </button>
               </div>
            </form>
         </Modal>
      </div>
   );
}