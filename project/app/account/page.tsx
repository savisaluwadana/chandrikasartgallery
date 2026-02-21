'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Loader2, User, Mail, Shield, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react';
import { PageHeader } from '@/components/page-header';

export default function AccountPage() {
  const { user, loading: authLoading, refreshSession } = useAuth();
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState<'profile' | 'password'>('profile');

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login');
    }
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
    }
  }, [user, authLoading, router]);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const res = await fetch('/api/account/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess('Profile updated successfully');
        await refreshSession();
      } else {
        setError(data.error || 'Failed to update profile');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/account/password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess('Password changed successfully');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setError(data.error || 'Failed to change password');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-black/20" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const isAdmin = user.role === 'admin';

  return (
    <div className="min-h-screen bg-white">
      <PageHeader title="My Account" backHref="/" backLabel="Home" />

      <div className="pt-32 pb-20 px-6 lg:px-12">
        <div className="max-w-2xl mx-auto">
          {/* User Header */}
          <div className="flex items-center gap-6 mb-12">
            <div className="w-20 h-20 rounded-full bg-black/[0.04] border border-black/[0.08] flex items-center justify-center">
              <span className="text-3xl font-light text-black/40">
                {user.name?.charAt(0)?.toUpperCase() || 'U'}
              </span>
            </div>
            <div>
              <h1 className="text-2xl font-light text-black mb-1">{user.name}</h1>
              <p className="text-black/40 text-sm">{user.email}</p>
              {isAdmin && (
                <span className="inline-flex items-center gap-1.5 mt-2 px-3 py-1 rounded-full bg-black/[0.05] text-xs uppercase tracking-wider text-black/50">
                  <Shield size={11} />
                  Admin
                </span>
              )}
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 p-1 rounded-xl bg-black/[0.03] border border-black/[0.05] mb-8">
            <button
              onClick={() => { setActiveTab('profile'); setError(''); setSuccess(''); }}
              className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all ${activeTab === 'profile'
                ? 'bg-white text-black shadow-sm border border-black/[0.06]'
                : 'text-black/50 hover:text-black hover:bg-black/[0.02]'
                }`}
            >
              Profile
            </button>
            <button
              onClick={() => { setActiveTab('password'); setError(''); setSuccess(''); }}
              className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all ${activeTab === 'password'
                ? 'bg-white text-black shadow-sm border border-black/[0.06]'
                : 'text-black/50 hover:text-black hover:bg-black/[0.02]'
                }`}
            >
              Password
            </button>
          </div>

          {/* Feedback */}
          {error && (
            <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4 mb-6 flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {success && (
            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 mb-6 flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
              <p className="text-emerald-600 text-sm">{success}</p>
            </div>
          )}

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <form onSubmit={handleProfileUpdate} className="space-y-6">
              <div className="rounded-2xl border border-black/[0.08] bg-white p-6 space-y-6 shadow-sm">
                <div className="space-y-2">
                  <label htmlFor="name" className="flex items-center gap-2 text-sm font-medium text-black/60">
                    <User size={14} />
                    Full Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    disabled={loading}
                    className="w-full px-4 py-3 rounded-xl bg-black/[0.02] border border-black/[0.08] text-black placeholder-black/30 focus:outline-none focus:border-black/20 focus:bg-white transition-all disabled:opacity-50"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="flex items-center gap-2 text-sm font-medium text-black/60">
                    <Mail size={14} />
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    disabled
                    className="w-full px-4 py-3 rounded-xl bg-black/[0.02] border border-black/[0.05] text-black/40 cursor-not-allowed"
                  />
                  <p className="text-xs text-black/30">Email cannot be changed</p>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-black text-white font-medium hover:bg-black/85 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </button>
            </form>
          )}

          {/* Password Tab */}
          {activeTab === 'password' && (
            <form onSubmit={handlePasswordChange} className="space-y-6">
              <div className="rounded-2xl border border-black/[0.08] bg-white p-6 space-y-6 shadow-sm">
                {[
                  { id: 'currentPassword', label: 'Current Password', value: currentPassword, setter: setCurrentPassword },
                  { id: 'newPassword', label: 'New Password', value: newPassword, setter: setNewPassword },
                  { id: 'confirmPassword', label: 'Confirm New Password', value: confirmPassword, setter: setConfirmPassword },
                ].map(field => (
                  <div key={field.id} className="space-y-2">
                    <label htmlFor={field.id} className="block text-sm font-medium text-black/60">
                      {field.label}
                    </label>
                    <input
                      id={field.id}
                      type="password"
                      value={field.value}
                      onChange={(e) => field.setter(e.target.value)}
                      required
                      disabled={loading}
                      placeholder="••••••••"
                      minLength={6}
                      className="w-full px-4 py-3 rounded-xl bg-black/[0.02] border border-black/[0.08] text-black placeholder-black/20 focus:outline-none focus:border-black/20 focus:bg-white transition-all disabled:opacity-50"
                    />
                  </div>
                ))}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-black text-white font-medium hover:bg-black/85 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Changing Password...
                  </>
                ) : (
                  'Change Password'
                )}
              </button>
            </form>
          )}

          {/* Admin Link */}
          {isAdmin && (
            <div className="mt-8 pt-8 border-t border-black/[0.05]">
              <Link
                href="/admin"
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border border-black/[0.08] text-black/60 text-sm font-medium hover:bg-black/[0.02] hover:text-black transition-all"
              >
                <Shield size={16} />
                Go to Admin Dashboard
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
