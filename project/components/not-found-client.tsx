'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Home, ShoppingBag, BookOpen, Image } from 'lucide-react';

export default function NotFoundClient() {
    return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6 relative overflow-hidden">
            {/* Subtle background orbs */}
            <div className="absolute top-[15%] left-[10%] w-[400px] h-[400px] bg-[#6CD8D1]/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[15%] right-[10%] w-[350px] h-[350px] bg-purple-300/10 rounded-full blur-[100px] pointer-events-none" />

            <div className="relative z-10 text-center max-w-2xl">
                {/* Large 404 Number */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                    className="mb-4"
                >
                    <span className="text-[180px] sm:text-[220px] font-extralight text-black/[0.04] leading-none select-none tracking-tighter block">
                        404
                    </span>
                </motion.div>

                {/* Artist monogram */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="-mt-24 mb-10 flex justify-center"
                >
                    <div className="w-20 h-20 rounded-full border border-black/10 flex items-center justify-center">
                        <span className="text-3xl font-serif italic text-black/20">CM</span>
                    </div>
                </motion.div>

                <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="block text-xs tracking-[0.3em] uppercase text-black/30 mb-4"
                >
                    Page not found
                </motion.span>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.25 }}
                    className="text-4xl md:text-5xl font-light text-black mb-5 leading-tight"
                >
                    This canvas is{' '}
                    <span className="font-serif italic text-[#6CD8D1]">empty</span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.35 }}
                    className="text-black/40 text-lg font-light mb-14 max-w-md mx-auto leading-relaxed"
                >
                    The page you are looking for doesn&apos;t exist or may have been moved.
                    Explore the collection instead.
                </motion.p>

                {/* Action buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.45 }}
                    className="flex flex-wrap gap-4 justify-center"
                >
                    <Link
                        href="/"
                        className="group flex items-center gap-3 px-8 py-4 bg-black text-white rounded-full font-medium hover:bg-black/85 transition-all shadow-lg"
                    >
                        <Home size={18} />
                        Return Home
                        <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <Link
                        href="/shop"
                        className="flex items-center gap-3 px-8 py-4 border border-black/10 text-black rounded-full font-light hover:bg-black/5 transition-all"
                    >
                        <ShoppingBag size={18} />
                        Browse Shop
                    </Link>
                </motion.div>

                {/* Secondary links */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.7, delay: 0.6 }}
                    className="mt-16 flex gap-8 justify-center"
                >
                    {[
                        { href: '/gallery', label: 'Gallery' },
                        { href: '/blog', label: 'Journal' },
                        { href: '/contact', label: 'Contact' },
                    ].map(link => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="text-sm text-black/30 hover:text-black transition-colors tracking-[0.1em] uppercase"
                        >
                            {link.label}
                        </Link>
                    ))}
                </motion.div>
            </div>
        </div>
    );
}
