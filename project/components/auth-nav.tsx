'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { User, LogOut, Settings, ChevronDown } from 'lucide-react';

interface AuthNavProps {
  className?: string;
}

export function AuthNav({ className }: AuthNavProps) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  if (loading) {
    return (
      <div className="w-8 h-8 rounded-full bg-black/5 animate-pulse" />
    );
  }

  if (!user) {
    return (
      <Link
        href="/auth/login"
        className="text-sm px-5 py-2 rounded-full border border-black/10 text-black hover:bg-black hover:text-white transition-all"
      >
        Sign In
      </Link>
    );
  }

  const isAdmin = user.role === 'admin';

  const handleLogout = async () => {
    setDropdownOpen(false);
    await logout();
    router.push('/');
    router.refresh();
  };

  return (
    <div className="relative">
      <button
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-full border border-black/10 hover:border-black/30 transition-all"
      >
        <div className="w-7 h-7 rounded-full bg-black/5 flex items-center justify-center">
          <span className="text-black text-xs font-medium">
            {user.name?.charAt(0)?.toUpperCase() || 'U'}
          </span>
        </div>
        <span className="text-sm text-black hidden sm:block">
          {user.name?.split(' ')[0] || 'User'}
        </span>
        <ChevronDown size={14} className={`text-black/40 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
      </button>

      {dropdownOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setDropdownOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-56 rounded-xl border border-black/10 bg-white shadow-xl overflow-hidden z-50">
            {/* User Info */}
            <div className="px-4 py-3 border-b border-black/[0.05]">
              <p className="text-sm font-medium text-black truncate">{user.name}</p>
              <p className="text-xs text-black/40 truncate">{user.email}</p>
              {isAdmin && (
                <span className="inline-block mt-2 px-2 py-0.5 rounded-full bg-black/5 text-[10px] uppercase tracking-wider text-black/60">
                  Admin
                </span>
              )}
            </div>

            {/* Menu Items */}
            <div className="p-2">
              {isAdmin && (
                <Link
                  href="/admin"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-black/70 hover:text-black hover:bg-black/[0.05] transition-all"
                >
                  <Settings size={16} />
                  <span>Studio Dashboard</span>
                </Link>
              )}
              <Link
                href="/account"
                onClick={() => setDropdownOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-black/70 hover:text-black hover:bg-black/[0.05] transition-all"
              >
                <User size={16} />
                <span>My Account</span>
              </Link>
            </div>

            {/* Sign Out */}
            <div className="p-2 border-t border-black/[0.05]">
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm text-red-500 hover:text-red-700 hover:bg-red-500/10 transition-all"
              >
                <LogOut size={16} />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

interface AuthNavMobileProps {
  onClose?: () => void;
}

export function AuthNavMobile({ onClose }: AuthNavMobileProps) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  if (loading) {
    return null;
  }

  if (!user) {
    return (
      <Link
        href="/auth/login"
        onClick={onClose}
        className="text-lg px-8 py-3 rounded-full border border-black/20 hover:bg-black hover:text-white transition-all text-black"
      >
        Sign In
      </Link>
    );
  }

  const isAdmin = user.role === 'admin';

  const handleLogout = async () => {
    onClose?.();
    await logout();
    router.push('/');
    router.refresh();
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="text-center mb-4">
        <div className="w-16 h-16 rounded-full bg-black/5 flex items-center justify-center mx-auto mb-3">
          <span className="text-black text-xl font-medium">
            {user.name?.charAt(0)?.toUpperCase() || 'U'}
          </span>
        </div>
        <p className="text-black font-light">{user.name}</p>
        <p className="text-black/40 text-sm">{user.email}</p>
      </div>

      {isAdmin && (
        <Link
          href="/admin"
          onClick={onClose}
          className="text-lg font-light tracking-wide text-black/60 hover:text-black transition-colors"
        >
          Studio Dashboard
        </Link>
      )}

      <button
        onClick={handleLogout}
        className="text-lg font-light tracking-wide text-red-500 hover:text-red-600 transition-colors"
      >
        Sign Out
      </button>
    </div>
  );
}
