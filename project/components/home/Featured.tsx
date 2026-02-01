'use client';

import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';

export function Featured() {
    return (
        <section className="py-40 px-6 lg:px-12 border-t border-black/[0.05]">
            <div className="max-w-[1800px] mx-auto">
                <div className="grid lg:grid-cols-12 gap-16 lg:gap-24 items-center">
                    {/* Text Content */}
                    <div className="lg:col-span-5">
                        <motion.span
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-xs tracking-[0.3em] uppercase text-black/40 mb-6 block"
                        >
                            The Artist
                        </motion.span>
                        <motion.h2
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="text-5xl md:text-6xl font-light leading-tight mb-10"
                        >
                            A Journey Through <br />
                            <span className="font-serif italic text-[#6CD8D1]">Color & Emotion</span>
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="text-black/50 text-xl leading-relaxed mb-12 font-light"
                        >
                            Chandrika Maelge creates art that bridges the gap between the visible
                            and the felt. With each brushstroke, she captures moments of profound
                            beauty and invites viewers into a world where imagination reigns supreme.
                        </motion.p>
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3 }}
                        >
                            <Link href="/blog">
                                <span className="group inline-flex items-center gap-2 text-lg text-black hover:text-black/70 transition-colors border-b border-black/30 pb-1">
                                    Read the Journal
                                    <ArrowUpRight size={18} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                </span>
                            </Link>
                        </motion.div>
                    </div>

                    {/* Image Placeholder */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="lg:col-span-7 relative aspect-[4/3] bg-gray-100 rounded-sm overflow-hidden group"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-black/[0.05] to-transparent opacity-50" />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-center transform group-hover:scale-105 transition-transform duration-700">
                                <div className="w-32 h-32 rounded-full border border-white/10 flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
                                    <span className="text-5xl font-serif italic text-white/50">CM</span>
                                </div>
                                <span className="text-white/30 text-sm tracking-[0.2em] uppercase">Featured Artwork</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
