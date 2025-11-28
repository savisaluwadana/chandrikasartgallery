'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { 
  Menu, 
  X, 
  LayoutDashboard, 
  FileText, 
  Package, 
  Image, 
  Users, 
  Mail, 
  Settings,
  ExternalLink,
  ChevronRight,
  LogOut,
  ChevronDown
} from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  const navItems = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/blog', label: 'Blog Posts', icon: FileText },
    { href: '/admin/products', label: 'Products', icon: Package },
    { href: '/admin/gallery', label: 'Gallery', icon: Image },
    { href: '/admin/subscribers', label: 'Subscribers', icon: Users },
    { href: '/admin/newsletter', label: 'Newsletter', icon: Mail },
    { href: '/admin/settings', label: 'Settings', icon: Settings },
  ];

  const isActive = (href: string) => {
    if (href === '/admin') return pathname === '/admin';
    return pathname.startsWith(href);
  };

  return (
    <div className="flex h-screen bg-black">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } fixed inset-y-0 left-0 z-50 w-64 bg-[#0a0a0a] border-r border-white/[0.08] transition-transform duration-300 lg:static lg:translate-x-0`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-white/[0.08]">
          <Link href="/admin" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center">
              <span className="text-black font-bold text-sm">CM</span>
            </div>
            <span className="font-semibold text-white text-sm">Chandrika Maelge</span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-white/60 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link key={item.href} href={item.href}>
                <span 
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    active 
                      ? 'bg-white text-black' 
                      : 'text-white/60 hover:text-white hover:bg-white/[0.05]'
                  }`}
                >
                  <Icon size={18} strokeWidth={active ? 2.5 : 2} />
                  <span>{item.label}</span>
                  {active && <ChevronRight size={16} className="ml-auto" />}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/[0.08] space-y-2">
          <Link 
            href="/" 
            target="_blank"
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-white/40 hover:text-white/60 hover:bg-white/[0.03] transition-all text-sm"
          >
            <ExternalLink size={16} />
            <span>View Site</span>
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-red-400/80 hover:text-red-400 hover:bg-red-500/10 transition-all text-sm"
          >
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="h-16 bg-[#0a0a0a] border-b border-white/[0.08] flex items-center px-6 shrink-0">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden text-white/60 hover:text-white transition-colors mr-4"
          >
            <Menu size={20} />
          </button>

          <div className="flex items-center gap-3 ml-auto relative">
            <button 
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-white/[0.05] transition-all"
            >
              <div className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center">
                <span className="text-white text-xs font-medium">
                  {user?.name?.charAt(0)?.toUpperCase() || 'A'}
                </span>
              </div>
              <span className="text-sm text-white/70 hidden sm:block">
                {user?.name?.split(' ')[0] || 'Admin'}
              </span>
              <ChevronDown size={14} className={`text-white/40 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* User Dropdown */}
            {userMenuOpen && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setUserMenuOpen(false)} 
                />
                <div className="absolute right-0 top-full mt-2 w-56 rounded-xl border border-white/[0.08] bg-[#0a0a0a] shadow-2xl overflow-hidden z-50">
                  <div className="px-4 py-3 border-b border-white/[0.05]">
                    <p className="text-sm font-medium text-white truncate">{user?.name}</p>
                    <p className="text-xs text-white/40 truncate">{user?.email}</p>
                    <span className="inline-block mt-2 px-2 py-0.5 rounded-full bg-white/10 text-[10px] uppercase tracking-wider text-white/60">
                      Admin
                    </span>
                  </div>
                  <div className="p-2">
                    <Link
                      href="/"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-white/70 hover:text-white hover:bg-white/[0.05] transition-all"
                    >
                      <ExternalLink size={16} />
                      <span>View Website</span>
                    </Link>
                  </div>
                  <div className="p-2 border-t border-white/[0.05]">
                    <button
                      onClick={() => {
                        setUserMenuOpen(false);
                        handleLogout();
                      }}
                      className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all"
                    >
                      <LogOut size={16} />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto bg-black p-6">
          {children}
        </main>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/80 z-40 lg:hidden"
        />
      )}
    </div>
  );
}
