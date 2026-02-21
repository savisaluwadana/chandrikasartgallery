'use client';

import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';

const categories = [
    {
        title: 'Original Paintings',
        description: 'One-of-a-kind masterpieces on canvas.',
        href: '/shop?category=painting',
        image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=1000&auto=format&fit=crop',
        size: 'large', // spanning 2 columns
    },
    {
        title: 'Fine Art Prints',
        description: 'Museum-quality reproductions.',
        href: '/shop?category=print',
        image: 'https://images.unsplash.com/photo-1580136906451-b97c0092625d?q=80&w=1000&auto=format&fit=crop',
        size: 'small',
    },
    {
        title: 'Digital Screensavers',
        description: 'Art for your digital spaces.',
        href: '/shop?category=screensaver',
        image: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=1000&auto=format&fit=crop',
        size: 'small',
    },
    {
        title: 'Handcrafted Necklaces',
        description: 'Wearable miniature art pieces.',
        href: '/shop?category=necklace',
        image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=1000&auto=format&fit=crop',
        size: 'wide', // Spanning full width or 2 cols depending on layout
    },
];

export function ShopCategories() {
    return (
        <section className="py-32 px-6 lg:px-12 bg-white">
            <div className="max-w-[1800px] mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-end mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <span className="text-xs tracking-[0.3em] uppercase text-black/40 mb-4 block">Curated Collections</span>
                        <h2 className="text-5xl md:text-6xl font-light text-black">
                            Explore by <span className="font-serif italic text-[#6CD8D1]">Category</span>
                        </h2>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                    >
                        <Link href="/shop" className="hidden md:inline-flex items-center gap-2 text-black border-b border-[#6CD8D1]/30 pb-1 hover:border-[#6CD8D1] transition-all">
                            View Full Gift Shop
                            <ArrowUpRight size={16} className="text-[#6CD8D1]" />
                        </Link>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[400px]">
                    {categories.map((cat, idx) => (
                        <Link
                            key={idx}
                            href={cat.href}
                            className={`group relative overflow-hidden rounded-2xl ${cat.size === 'large' ? 'md:col-span-2' :
                                cat.size === 'wide' ? 'md:col-span-3' : 'md:col-span-1'
                                }`}
                        >
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className="w-full h-full"
                            >
                                {/* Image Background */}
                                <div className="absolute inset-0">
                                    <img
                                        src={cat.image}
                                        alt={cat.title}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-[#6CD8D1]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 mix-blend-multiply" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#6CD8D1]/90 via-transparent to-transparent opacity-60" />
                                </div>

                                {/* Content */}
                                <div className="absolute bottom-0 left-0 p-8 md:p-10 w-full">
                                    <h3 className="text-3xl text-white font-light mb-2">{cat.title}</h3>
                                    <div className="flex items-center justify-between">
                                        <p className="text-white/70 text-sm font-light tracking-wide">{cat.description}</p>
                                        <span className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                                            <ArrowUpRight size={20} className="text-white" />
                                        </span>
                                    </div>
                                </div>
                            </motion.div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
