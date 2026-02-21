'use client';

import { useRef, useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { OptimizedImage } from '@/components/OptimizedImage';
import { motion, useScroll, useTransform } from 'framer-motion';

export function Featured() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    const y = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
    const textY = useTransform(scrollYProgress, [0, 1], ["0%", "-10%"]);

    const [featuredImage, setFeaturedImage] = useState<string | null>(null);
    const [featuredTitle, setFeaturedTitle] = useState<string>('');

    useEffect(() => {
        fetch('/api/shop/products')
            .then(r => r.json())
            .then((products: Array<{ images?: string[]; title?: string }>) => {
                if (Array.isArray(products) && products.length > 0) {
                    const first = products.find(p => p.images && p.images.length > 0) || products[0];
                    if (first?.images?.[0]) {
                        setFeaturedImage(first.images[0]);
                        setFeaturedTitle(first.title || '');
                    }
                }
            })
            .catch(() => { });
    }, []);

    return (
        <section ref={containerRef} className="py-32 px-6 lg:px-12 border-t border-black/[0.05] overflow-hidden">
            <div className="max-w-[1800px] mx-auto">
                <div className="grid lg:grid-cols-2 gap-20 items-center">
                    {/* Text Content - Stickyish feel */}
                    <motion.div style={{ y: textY }} className="order-2 lg:order-1">
                        <motion.span
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="text-xs tracking-[0.3em] uppercase text-black/40 mb-8 block font-medium"
                        >
                            The Vision
                        </motion.span>
                        <motion.h2
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="text-6xl md:text-7xl lg:text-8xl font-light leading-[0.9] mb-12 tracking-tight"
                        >
                            Emotion <br />
                            <span className="font-serif italic text-[#6CD8D1]">Captured</span> <br />
                            In Time
                        </motion.h2>
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="max-w-xl"
                        >
                            <p className="text-black/50 text-xl leading-relaxed mb-8 font-light">
                                Chandrika Maelge creates art that bridges the gap between the visible
                                and the felt. With each brushstroke, she captures moments of profound
                                beauty and invites viewers into a world where imagination reigns supreme.
                            </p>
                            <p className="text-black/50 text-xl leading-relaxed mb-12 font-light">
                                Her work is not just seen; it is experienced. A symphony of color and
                                light that resonates with the soul.
                            </p>

                            <Link href="/about" className="group inline-flex items-center gap-3 text-lg text-black hover:text-[#6CD8D1] transition-colors">
                                <span className="border-b border-black/20 pb-0.5 group-hover:border-[#6CD8D1]">Read the Artist's Story</span>
                                <ArrowUpRight size={20} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                            </Link>
                        </motion.div>
                    </motion.div>

                    {/* Parallax Image */}
                    <div className="relative order-1 lg:order-2">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-br from-[#6CD8D1]/10 to-transparent blur-3xl -z-10" />
                        <motion.div
                            style={{ y }}
                            className="relative aspect-[3/4] md:aspect-[4/5] bg-gray-100 rounded-sm overflow-hidden shadow-2xl shadow-black/5"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-[#6CD8D1]/20 to-transparent mix-blend-multiply opacity-60 z-10" />
                            {featuredImage ? (
                                <OptimizedImage
                                    src={featuredImage}
                                    alt={featuredTitle || 'Featured Artwork'}
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 1024px) 100vw, 50vw"
                                />
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center bg-[#f8f7f5]">
                                    <div className="text-center">
                                        <div className="w-48 h-48 rounded-full border border-black/5 flex items-center justify-center mx-auto mb-6">
                                            <span className="text-8xl font-serif italic text-black/10">CM</span>
                                        </div>
                                        <span className="text-black/30 text-sm tracking-[0.2em] uppercase">Featured Work</span>
                                    </div>
                                </div>
                            )}
                        </motion.div>

                        {/* Decorative tag */}
                        {featuredTitle && (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                className="absolute -bottom-6 -right-4 bg-white border border-black/[0.06] shadow-lg rounded-xl p-4 max-w-[180px] z-20"
                            >
                                <p className="text-[10px] tracking-[0.2em] uppercase text-black/30 mb-1">Featured</p>
                                <p className="text-sm font-light text-black line-clamp-2">{featuredTitle}</p>
                                <Link href="/shop" className="inline-flex items-center gap-1 mt-2 text-xs text-[#6CD8D1] hover:text-[#5BC0B9] transition-colors">
                                    View in Shop <ArrowUpRight size={10} />
                                </Link>
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
