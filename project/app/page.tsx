'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { Menu, X } from 'lucide-react';
import { AuthNav, AuthNavMobile } from '@/components/auth-nav';
import { motion, AnimatePresence } from 'framer-motion';

import { Hero } from '@/components/home/Hero';
import { Footer } from '@/components/home/Footer';

// Lazy load heavy components below the fold
const Featured = dynamic(() => import('@/components/home/Featured').then(mod => mod.Featured), {
  loading: () => <div className="h-96 w-full bg-[#050505]" />
});
const Services = dynamic(() => import('@/components/home/Services').then(mod => mod.Services), {
  loading: () => <div className="h-96 w-full bg-[#080808]" />
});
const Newsletter = dynamic(() => import('@/components/home/Newsletter').then(mod => mod.Newsletter), {
  loading: () => <div className="h-96 w-full bg-[#050505]" />
});

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '/gallery', label: 'Gallery' },
    { href: '/shop', label: 'Collection' },
    { href: '/blog', label: 'Journal' },
    { href: '/subscribe', label: 'Subscribe' },
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-white/20">
      {/* Navigation */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 w-full z-50 transition-all duration-500 ${scrolled ? 'bg-[#050505]/80 backdrop-blur-md border-b border-white/[0.05]' : 'bg-transparent'}`}
      >
        <div className="max-w-[1800px] mx-auto px-6 lg:px-12">
          <div className="flex items-center justify-between h-24">
            {/* Logo */}
            <Link href="/" className="relative z-50 group">
              <div className="flex flex-col">
                <span className="text-xl tracking-[0.2em] font-light uppercase group-hover:opacity-70 transition-opacity">
                  Chandrika <span className="font-medium">Maelge</span>
                </span>
                <span className="text-[10px] tracking-[0.4em] text-white/40 uppercase mt-1">Fine Art</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-16">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-white/60 hover:text-white transition-colors tracking-[0.1em] uppercase relative group overflow-hidden"
                >
                  <span className="relative z-10">{link.label}</span>
                  <span className="absolute bottom-0 left-0 w-full h-[1px] bg-white transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out" />
                </Link>
              ))}
              <AuthNav />
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden relative z-50 p-2 hover:bg-white/5 rounded-full transition-colors"
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="md:hidden fixed inset-0 bg-[#050505] z-40 flex flex-col"
            >
              {/* Mobile Menu Header with Logo */}
              <div className="flex items-center justify-between h-24 px-6">
                <Link href="/" onClick={() => setMenuOpen(false)} className="group">
                  <div className="flex flex-col">
                    <span className="text-xl tracking-[0.2em] font-light uppercase group-hover:opacity-70 transition-opacity">
                      Chandrika <span className="font-medium">Maelge</span>
                    </span>
                    <span className="text-[10px] tracking-[0.4em] text-white/40 uppercase mt-1">Fine Art</span>
                  </div>
                </Link>
                <button
                  onClick={() => setMenuOpen(false)}
                  className="p-2 hover:bg-white/5 rounded-full transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Mobile Menu Links */}
              <div className="flex-1 flex flex-col justify-center items-center gap-8">
                {navLinks.map((link, index) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.3 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setMenuOpen(false)}
                      className="text-4xl font-light tracking-wide hover:text-white/60 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
                <motion.div
                  className="mt-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.3 }}
                >
                  <AuthNavMobile onClose={() => setMenuOpen(false)} />
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      <Hero />
      <Featured />
      <Services />
      <Newsletter />
      <Footer />
    </div>
  );
}
