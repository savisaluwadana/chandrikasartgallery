'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  FileText,
  Package,
  Users,
  Image,
  TrendingUp,
  ArrowUpRight,
  Plus
} from 'lucide-react';

interface Stats {
  blogPosts: number;
  products: number;
  subscribers: number;
  images: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    blogPosts: 0,
    products: 0,
    subscribers: 0,
    images: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const [blogRes, productsRes, subscribersRes, imagesRes] = await Promise.all([
          fetch('/api/blog/list', { cache: 'no-store' }).catch(() => ({ ok: false })),
          fetch('/api/shop/products', { cache: 'no-store' }).catch(() => ({ ok: false })),
          fetch('/api/subscribers/list', { cache: 'no-store' }).catch(() => ({ ok: false })),
          fetch('/api/images/list', { cache: 'no-store' }).catch(() => ({ ok: false }))
        ]);

        const blogData = blogRes.ok ? await (blogRes as Response).json() : [];
        const productsData = productsRes.ok ? await (productsRes as Response).json() : [];
        const subscribersData = subscribersRes.ok ? await (subscribersRes as Response).json() : [];
        const imagesData = imagesRes.ok ? await (imagesRes as Response).json() : [];

        setStats({
          blogPosts: Array.isArray(blogData) ? blogData.length : 0,
          products: Array.isArray(productsData) ? productsData.length : 0,
          subscribers: Array.isArray(subscribersData) ? subscribersData.length : 0,
          images: Array.isArray(imagesData) ? imagesData.length : 0
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  const statCards = [
    {
      label: 'Blog Posts',
      value: stats.blogPosts,
      icon: FileText,
      href: '/admin/blog',
      change: '+2 this week',
      color: 'bg-violet-500/10 text-violet-400'
    },
    {
      label: 'Products',
      value: stats.products,
      icon: Package,
      href: '/admin/products',
      change: 'Manage inventory',
      color: 'bg-blue-500/10 text-blue-400'
    },
    {
      label: 'Subscribers',
      value: stats.subscribers,
      icon: Users,
      href: '/admin/subscribers',
      change: 'Active users',
      color: 'bg-emerald-500/10 text-emerald-400'
    },
    {
      label: 'Gallery Images',
      value: stats.images,
      icon: Image,
      href: '/admin/gallery',
      change: 'Media library',
      color: 'bg-amber-500/10 text-amber-400'
    },
  ];

  const quickActions = [
    { label: 'New Blog Post', href: '/admin/blog/new', icon: FileText },
    { label: 'Add Product', href: '/admin/products/new', icon: Package },
    { label: 'Send Newsletter', href: '/admin/newsletter', icon: Users },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8 bg-white min-h-screen p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-black">Dashboard</h1>
          <p className="text-black/40 text-sm mt-1">Welcome back to your admin panel</p>
        </div>
        <div className="flex items-center gap-2">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link key={action.href} href={action.href}>
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-black text-white text-sm font-medium hover:bg-black/90 transition-colors">
                  <Plus size={16} />
                  {action.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link key={stat.label} href={stat.href}>
              <div className="bg-white border border-black/[0.08] rounded-xl p-5 hover:border-black/[0.16] hover:shadow-md transition-all group">
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-2.5 rounded-lg ${stat.color}`}>
                    <Icon size={18} />
                  </div>
                  <ArrowUpRight
                    size={16}
                    className="text-black/20 group-hover:text-black/60 transition-colors"
                  />
                </div>
                <div className="space-y-1">
                  <div className="text-3xl font-semibold text-black">
                    {loading ? (
                      <div className="h-9 w-12 bg-black/10 rounded animate-pulse" />
                    ) : (
                      stat.value
                    )}
                  </div>
                  <div className="text-sm text-black/40">{stat.label}</div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Getting Started */}
      <div className="bg-white border border-black/[0.08] rounded-xl overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-black/[0.08]">
          <h2 className="text-lg font-medium text-black">Getting Started</h2>
          <p className="text-sm text-black/40 mt-0.5">Complete these steps to set up your platform</p>
        </div>
        <div className="p-6">
          <div className="grid gap-3">
            {[
              { text: 'Create your first blog post', href: '/admin/blog/new', done: stats.blogPosts > 0 },
              { text: 'Add art products to your shop', href: '/admin/products/new', done: stats.products > 0 },
              { text: 'Upload images to your gallery', href: '/admin/gallery', done: stats.images > 0 },
              { text: 'Configure email settings', href: '/admin/settings', done: false },
              { text: 'Send your first newsletter', href: '/admin/newsletter', done: false },
            ].map((item, i) => (
              <Link key={i} href={item.href}>
                <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-black/[0.03] transition-colors group">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${item.done
                    ? 'bg-emerald-500 border-emerald-500'
                    : 'border-black/20'
                    }`}>
                    {item.done && (
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <span className={`text-sm ${item.done ? 'text-black/40 line-through' : 'text-black/70'}`}>
                    {item.text}
                  </span>
                  <ArrowUpRight
                    size={14}
                    className="ml-auto text-black/0 group-hover:text-black/40 transition-colors"
                  />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity placeholder */}
      <div className="bg-white border border-black/[0.08] rounded-xl overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-black/[0.08] flex items-center justify-between">
          <div>
            <h2 className="text-lg font-medium text-black">Recent Activity</h2>
            <p className="text-sm text-black/40 mt-0.5">Your latest updates and changes</p>
          </div>
          <TrendingUp size={18} className="text-black/20" />
        </div>
        <div className="p-12 text-center">
          <div className="text-black/20 text-sm">No recent activity yet</div>
          <p className="text-black/10 text-xs mt-1">Activity will appear here as you use the platform</p>
        </div>
      </div>
    </div>
  );
}
