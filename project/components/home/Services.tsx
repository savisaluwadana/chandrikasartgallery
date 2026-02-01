'use client';

import Link from 'next/link';
import { ArrowRight, ArrowUpRight } from 'lucide-react';

export function Services() {
    return (
        <section className="py-40 px-6 lg:px-12 bg-white">
            <div className="max-w-[1800px] mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-end mb-24">
                    <div>
                        <span className="text-xs tracking-[0.3em] uppercase text-black/40 mb-6 block">What We Offer</span>
                        <h2 className="text-5xl md:text-7xl font-light">
                            Experience the <br />
                            <span className="font-serif italic text-transparent bg-clip-text bg-gradient-to-r from-[#6CD8D1] to-purple-500">Extraordinary</span>
                        </h2>
                    </div>
                    <Link href="/shop" className="hidden md:block">
                        <span className="group inline-flex items-center gap-3 px-8 py-4 border border-black/10 rounded-full text-sm font-medium hover:bg-black text-black hover:text-white transition-all">
                            View All Services
                            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                        </span>
                    </Link>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                        {
                            title: 'Original Art',
                            description: 'One-of-a-kind pieces crafted with passion and precision',
                            link: '/shop',
                            color: 'hover:bg-blue-100/50',
                            gradient: 'from-[#6CD8D1] to-blue-400'
                        },
                        {
                            title: 'Limited Prints',
                            description: 'Exclusive numbered editions for discerning collectors',
                            link: '/shop',
                            color: 'hover:bg-purple-100/50',
                            gradient: 'from-purple-400 to-pink-400'
                        },
                        {
                            title: 'Commissions',
                            description: 'Bespoke artwork tailored to your vision and space',
                            link: '/subscribe',
                            color: 'hover:bg-amber-100/50',
                            gradient: 'from-amber-400 to-orange-400'
                        },
                        {
                            title: 'Art Journal',
                            description: 'Insights into the creative process and artistic journey',
                            link: '/blog',
                            color: 'hover:bg-rose-100/50',
                            gradient: 'from-rose-400 to-red-400'
                        },
                    ].map((item, idx) => (
                        <Link key={idx} href={item.link} className={`group relative p-12 h-96 flex flex-col justify-between rounded-2xl border border-black/5 transition-all duration-500 hover:shadow-2xl hover:shadow-${item.gradient.split(' ')[1]}/20 hover:-translate-y-2 overflow-hidden`}>
                            {/* Hover Gradient Background */}
                            <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                            <div className="relative z-10">
                                <span className="text-6xl font-serif italic text-black/5 block mb-8 group-hover:text-white/20 transition-colors">0{idx + 1}</span>
                                <h3 className="text-2xl font-light mb-4 text-black group-hover:text-white transition-colors">{item.title}</h3>
                                <p className="text-black/40 text-sm leading-relaxed font-light max-w-[200px] group-hover:text-white/80 transition-colors">{item.description}</p>
                            </div>
                            <div className="relative z-10 flex justify-end">
                                <div className="w-12 h-12 rounded-full border border-black/10 flex items-center justify-center group-hover:bg-white group-hover:border-transparent transition-all">
                                    <ArrowUpRight size={24} className="text-black/20 group-hover:text-black transition-colors" />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
