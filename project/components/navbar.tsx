'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { AuthNav, AuthNavMobile } from '@/components/auth-nav';
import { CartButton } from '@/components/cart-drawer';
import { motion, AnimatePresence } from 'framer-motion';

export function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const pathname = usePathname();

    // Hide navbar on admin and auth pages
    const isHiddenPage = pathname?.startsWith('/admin') || pathname?.startsWith('/auth');

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    if (isHiddenPage) return null;

    const navLinks = [
        { href: '/shop', label: 'Gift Shop' },
        { href: '/gallery', label: 'Gallery' },
        { href: '/about', label: 'About' },
        { href: '/contact', label: 'Contact' },
        { href: '/blog', label: 'Journal' },
        { href: '/subscribe', label: 'Subscribe' },
    ];

    // For non-home pages, we might want the navbar to always have a background
    // to prevent clashing with content that scrolls under it immediately.
    const isHome = pathname === '/';
    const hasBackground = scrolled || !isHome;

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className={`fixed top-0 w-full z-50 transition-all duration-500 ${hasBackground ? 'bg-white/80 backdrop-blur-xl border-b border-black/[0.05] shadow-sm' : 'bg-transparent'}`}
        >
            <div className="max-w-[1800px] mx-auto px-6 lg:px-12">
                <div className="flex items-center justify-between h-24">
                    {/* Logo */}
                    <Link href="/" className="relative z-50 group">
                        <div className="flex flex-col">
                            <span className="text-xl tracking-[0.2em] font-light uppercase group-hover:opacity-70 transition-opacity">
                                Chandrika <span className="font-medium">Maelge</span>
                            </span>
                            <span className="text-[10px] tracking-[0.4em] text-black/40 uppercase mt-1">Fine Art</span>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-16">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="text-sm text-black/60 hover:text-black transition-colors tracking-[0.1em] uppercase relative group overflow-hidden"
                            >
                                <span className="relative z-10">{link.label}</span>
                                <span className="absolute bottom-0 left-0 w-full h-[1px] bg-black transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out" />
                            </Link>
                        ))}
                        <CartButton />
                        <AuthNav />
                    </div>

                    {/* Mobile Menu Toggle */}
                    <button
                        onClick={() => setMenuOpen(!menuOpen)}
                        className="md:hidden relative z-50 p-2 hover:bg-black/5 rounded-full transition-colors"
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
                        className="md:hidden fixed inset-0 bg-white z-40 flex flex-col"
                    >
                        {/* Mobile Menu Header with Logo */}
                        <div className="flex items-center justify-between h-24 px-6">
                            <Link href="/" onClick={() => setMenuOpen(false)} className="group">
                                <div className="flex flex-col">
                                    <span className="text-xl tracking-[0.2em] font-light uppercase group-hover:opacity-70 transition-opacity">
                                        Chandrika <span className="font-medium">Maelge</span>
                                    </span>
                                    <span className="text-[10px] tracking-[0.4em] text-black/40 uppercase mt-1">Fine Art</span>
                                </div>
                            </Link>
                            <button
                                onClick={() => setMenuOpen(false)}
                                className="p-2 hover:bg-black/5 rounded-full transition-colors"
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
                                        className="text-4xl font-light tracking-wide hover:text-black/60 transition-colors"
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
    );
}
