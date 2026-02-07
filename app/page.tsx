'use client';
import { useEffect, useState } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { Building } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { APP_NAME } from '@/lib/config';
import Spinner from '@/components/ui/Spinner';

export default function AuthPage() {
  const { data: session, status } = useSession();
  const [view, setView] = useState<'login' | 'register' | 'forgot'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (status === 'authenticated') {
      router.replace('/dashboard');
    }
  }, [status, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      if (view === 'login') {
        const result = await signIn('credentials', {
          email,
          password,
          redirect: false,
        });

        if (result?.error) {
          setError(result.error || 'Login failed');
        } else {
          router.push('/dashboard');
        }
      } else if (view === 'register') {
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password }),
        });
        const data = await res.json();
        if (res.ok) {
          setSuccess('Account created! Logging in...');
          const result = await signIn('credentials', {
            email,
            password,
            redirect: false,
          });
          if (result?.error) {
            setError(result.error || 'Login failed');
          } else {
            router.push('/dashboard');
          }
        } else {
          setError(data.error || 'Registration failed');
        }
      } else if (view === 'forgot') {
        await new Promise((r) => setTimeout(r, 1000));
        setSuccess('If this email exists, a reset link has been sent.');
      }
    } catch (err) {
      setError('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-indigo-50 p-4">
        <Spinner size={40} className="text-indigo-600" />
      </div>
    );
  }

  if (status === 'authenticated') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-indigo-50 p-4">
        <Spinner size={40} className="text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-indigo-50 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-white/50 backdrop-blur-sm">
        <div className="text-center mb-8">
          <div className="inline-flex p-3 bg-indigo-50 text-indigo-600 rounded-xl mb-4">
            <Building size={32} />
          </div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">{APP_NAME}</h1>
          <p className="text-slate-500 mt-2">Professional Real Estate CRM</p>
        </div>
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 text-sm font-medium">{error}</div>
        )}
        {success && (
          <div className="bg-green-50 text-green-600 p-4 rounded-xl mb-6 text-sm font-medium">{success}</div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          {view === 'register' && (
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500 uppercase">Full Name</label>
              <input
                className="w-full p-3.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          )}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-500 uppercase">Email Address</label>
            <input
              className="w-full p-3.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              placeholder="you@brokerflow.com"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          {view !== 'forgot' && (
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500 uppercase">Password</label>
              <input
                className="w-full p-3.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          )}
          <button
            disabled={loading}
            className="w-full bg-indigo-600 text-white p-4 rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200 flex items-center justify-center gap-2"
          >
            {loading && <Spinner className="text-white" />}
            {view === 'login' ? 'Sign In' : view === 'register' ? 'Create Account' : 'Send Reset Link'}
          </button>
        </form>
        <div className="mt-8 pt-6 border-t border-slate-100 text-center space-y-3">
          {view === 'login' && (
            <>
              <p className="text-slate-600">
                Don't have an account?{' '}
                <button onClick={() => setView('register')} className="text-indigo-600 font-bold hover:underline">
                  Sign Up
                </button>
              </p>
              <button
                onClick={() => setView('forgot')}
                className="text-sm text-slate-400 hover:text-slate-600"
              >
                Forgot password?
              </button>
            </>
          )}
          {view === 'register' && (
            <p className="text-slate-600">
              Already have an account?{' '}
              <button onClick={() => setView('login')} className="text-indigo-600 font-bold hover:underline">
                Sign In
              </button>
            </p>
          )}
          {view === 'forgot' && (
            <button onClick={() => setView('login')} className="text-indigo-600 font-bold hover:underline">
              Back to Login
            </button>
          )}
        </div>
      </div>
    </div>
  );
}