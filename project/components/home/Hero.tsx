'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { motion, useScroll, useTransform, useSpring, useMotionValue, useMotionTemplate } from 'framer-motion';

export function Hero() {
    const heroRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: heroRef,
        offset: ["start start", "end start"]
    });

    const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
    const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
    const scale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);

    // Mouse parralax effect
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const handleMouseMove = ({ clientX, clientY }: { clientX: number, clientY: number }) => {
        const { innerWidth, innerHeight } = window;
        const x = clientX / innerWidth;
        const y = clientY / innerHeight;
        mouseX.set(x);
        mouseY.set(y);
    };

    const xSpring = useSpring(mouseX, { stiffness: 50, damping: 20 });
    const ySpring = useSpring(mouseY, { stiffness: 50, damping: 20 });

    const moveX = useTransform(xSpring, [0, 1], [-20, 20]);
    const moveY = useTransform(ySpring, [0, 1], [-20, 20]);
    const moveXInverse = useTransform(xSpring, [0, 1], [20, -20]);
    const moveYInverse = useTransform(ySpring, [0, 1], [20, -20]);

    return (
        <section
            ref={heroRef}
            onMouseMove={handleMouseMove}
            className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20"
        >
            {/* Dynamic Background Elements */}
            <motion.div style={{ y, opacity, scale }} className="absolute inset-0 z-0 pointer-events-none">
                <motion.div
                    style={{ x: moveX, y: moveY }}
                    className="absolute top-[10%] left-[10%] w-[50vw] h-[50vw] max-w-[800px] max-h-[800px] bg-gradient-to-r from-[#6CD8D1]/20 to-blue-400/20 rounded-full blur-[100px] mix-blend-multiply"
                />
                <motion.div
                    style={{ x: moveXInverse, y: moveYInverse }}
                    className="absolute bottom-[10%] right-[5%] w-[45vw] h-[45vw] max-w-[600px] max-h-[600px] bg-gradient-to-l from-purple-300/20 to-[#6CD8D1]/20 rounded-full blur-[120px] mix-blend-multiply"
                />
            </motion.div>

            <div className="relative z-10 max-w-[1800px] mx-auto px-6 lg:px-12 w-full">
                <div className="max-w-7xl mx-auto text-center">
                    {/* Tagline */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="mb-8"
                    >
                        <span className="inline-block px-4 py-2 rounded-full border border-black/5 bg-white/50 backdrop-blur-sm text-xs tracking-[0.3em] uppercase text-black/60 shadow-sm">
                            Curated Fine Art
                        </span>
                    </motion.div>

                    {/* Main Heading */}
                    <h1 className="text-[12vw] sm:text-[10vw] font-light leading-[0.85] tracking-tighter mb-12 text-black mix-blend-darken">
                        <motion.span
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                            className="block"
                        >
                            Where Art
                        </motion.span>
                        <motion.span
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                            className="block font-serif italic text-[#6CD8D1]"
                        >
                            Transcends
                        </motion.span>
                    </h1>

                    {/* Description */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.6 }}
                        className="text-lg md:text-2xl text-black/50 max-w-2xl mx-auto leading-relaxed mb-16 font-light"
                    >
                        A curated collection of masterpieces designed to evoke emotion and transform your space into a sanctuary of profound beauty.
                    </motion.p>

                    {/* CTAs */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.7 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-6"
                    >
                        <Link href="/shop" className="group relative">
                            <span className="absolute inset-0 bg-[#6CD8D1] rounded-full blur-md opacity-40 group-hover:opacity-60 transition-opacity duration-300" />
                            <span className="relative flex items-center gap-4 px-12 py-5 bg-black text-white rounded-full text-lg font-medium hover:scale-105 transition-transform duration-300">
                                Explore Collection
                                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                            </span>
                        </Link>
                        <Link href="/about">
                            <span className="group inline-flex items-center gap-4 px-10 py-5 bg-white border border-black/10 rounded-full text-lg font-light text-black hover:bg-black/5 hover:border-black/20 transition-all">
                                Meet the Artist
                                <ArrowUpRight size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                            </span>
                        </Link>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
