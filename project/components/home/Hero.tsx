'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight, ChevronDown } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';

export function Hero() {
    const heroRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: heroRef,
        offset: ["start start", "end start"]
    });

    const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
    const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

    const fadeInUp = {
        hidden: { opacity: 0, y: 60 },
        visible: (i: number) => ({
            opacity: 1,
            y: 0,
            transition: {
                delay: i * 0.1,
                duration: 0.8,
                ease: [0.215, 0.61, 0.355, 1] as const,
            },
        }),
    };

    return (
        <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
            {/* Background Elements */}
            <motion.div style={{ y, opacity }} className="absolute inset-0 z-0">
                <div className="absolute top-1/4 left-1/4 w-[800px] h-[800px] bg-gradient-to-r from-[#6CD8D1]/10 to-blue-500/10 rounded-full blur-[120px] opacity-40" />
                <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-gradient-to-r from-[#6CD8D1]/10 to-teal-500/10 rounded-full blur-[120px] opacity-40" />
                <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-multiply" />
            </motion.div>

            <div className="relative z-10 max-w-[1800px] mx-auto px-6 lg:px-12 w-full">
                <div className="max-w-6xl">
                    {/* Tagline */}
                    <motion.div
                        custom={0}
                        initial="hidden"
                        animate="visible"
                        variants={fadeInUp}
                        className="inline-flex items-center gap-4 mb-12"
                    >
                        <div className="w-16 h-[1px] bg-black/30" />
                        <span className="text-sm tracking-[0.4em] uppercase text-black/60">Contemporary Fine Art</span>
                    </motion.div>

                    {/* Main Heading */}
                    <motion.h1
                        custom={1}
                        initial="hidden"
                        animate="visible"
                        variants={fadeInUp}
                        className="text-6xl sm:text-7xl md:text-8xl lg:text-[10rem] font-light leading-[0.9] tracking-tight mb-12 text-black"
                    >
                        Where Art <br />
                        <span className="font-serif italic text-[#6CD8D1]">Transcends</span> <br />
                        The Ordinary
                    </motion.h1>

                    {/* Description */}
                    <motion.p
                        custom={2}
                        initial="hidden"
                        animate="visible"
                        variants={fadeInUp}
                        className="text-xl md:text-2xl text-black/50 max-w-2xl leading-relaxed mb-16 font-light"
                    >
                        A curated collection of masterpieces that evoke emotion and transform spaces into sanctuaries of profound beauty.
                    </motion.p>

                    {/* CTAs */}
                    <motion.div
                        custom={3}
                        initial="hidden"
                        animate="visible"
                        variants={fadeInUp}
                        className="flex flex-col sm:flex-row gap-6"
                    >
                        <Link href="/shop">
                            <span className="group inline-flex items-center gap-4 px-10 py-5 bg-black text-white rounded-full text-lg font-medium hover:bg-black/90 transition-all transform hover:scale-105 duration-300">
                                View Gift Shop
                                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                            </span>
                        </Link>
                        <Link href="/blog">
                            <span className="group inline-flex items-center gap-4 px-10 py-5 border border-black/20 rounded-full text-lg font-light hover:bg-black/5 transition-all">
                                Read Journal
                                <ArrowUpRight size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                            </span>
                        </Link>
                    </motion.div>
                </div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5, duration: 1 }}
                className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 text-black/30"
            >
                <span className="text-[10px] tracking-[0.3em] uppercase">Scroll</span>
                <ChevronDown className="animate-bounce" size={20} />
            </motion.div>
        </section>
    );
}
