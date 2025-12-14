'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { AuthNav } from '@/components/auth-nav';
import { CartButton } from '@/components/cart-drawer';

interface PageHeaderProps {
  title: string;
  backHref?: string;
  backLabel?: string;
}

export function PageHeader({ title, backHref = '/', backLabel = 'Back' }: PageHeaderProps) {
  return (
    <nav className="fixed top-0 w-full z-40 bg-black/80 backdrop-blur-xl border-b border-white/[0.05]">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex items-center justify-between h-20">
          <Link href={backHref} className="flex items-center gap-3 text-white/60 hover:text-white transition-colors">
            <ArrowLeft size={18} />
            <span className="text-sm tracking-wide">{backLabel}</span>
          </Link>
          <span className="text-lg tracking-[0.2em] font-light uppercase text-white">
            {title}
          </span>
          <div className="min-w-[80px] flex items-center justify-end gap-2">
            <CartButton />
            <AuthNav />
          </div>
        </div>
      </div>
    </nav>
  );
}
