'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

interface PageHeaderProps {
  title: string;
  backHref?: string;
  backLabel?: string;
}

export function PageHeader({ title, backHref = '/', backLabel = 'Back' }: PageHeaderProps) {
  return (
    <nav className="sticky top-24 w-full z-30 bg-white/90 backdrop-blur-md border-b border-black/[0.05]">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex items-center justify-between h-16">
          <Link href={backHref} className="flex items-center gap-3 text-black/60 hover:text-black transition-colors">
            <ArrowLeft size={16} />
            <span className="text-sm tracking-wide">{backLabel}</span>
          </Link>
          <span className="text-sm md:text-base tracking-[0.2em] font-light uppercase text-black absolute left-1/2 -translate-x-1/2">
            {title}
          </span>
          {/* Spacer to balance the back button */}
          <div className="w-[100px]" />
        </div>
      </div>
    </nav>
  );
}
