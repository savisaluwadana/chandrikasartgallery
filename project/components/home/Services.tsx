'use client';

import Link from 'next/link';
import { ArrowRight, ArrowUpRight } from 'lucide-react';

export function Services() {
    return (
        <section className="py-40 px-6 lg:px-12 bg-gray-50">
            <div className="max-w-[1800px] mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-end mb-24">
                    <div>
                        <span className="text-xs tracking-[0.3em] uppercase text-black/40 mb-6 block">What We Offer</span>
                        <h2 className="text-5xl md:text-7xl font-light">
                            Experience the <br />
                            <span className="font-serif italic text-[#6CD8D1]">Extraordinary</span>
                        </h2>
                    </div>
                    <Link href="/shop" className="hidden md:block">
                        <span className="group inline-flex items-center gap-3 px-8 py-4 border border-black/10 rounded-full text-sm font-medium hover:bg-black text-black hover:text-white transition-all">
                            View All Services
                            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                        </span>
                    </Link>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-px bg-black/5 border border-black/5">
                    {[
                        {
                            title: 'Original Art',
                            description: 'One-of-a-kind pieces crafted with passion and precision',
                            link: '/shop',
                        },
                        {
                            title: 'Limited Prints',
                            description: 'Exclusive numbered editions for discerning collectors',
                            link: '/shop',
                        },
                        {
                            title: 'Commissions',
                            description: 'Bespoke artwork tailored to your vision and space',
                            link: '/subscribe',
                        },
                        {
                            title: 'Art Journal',
                            description: 'Insights into the creative process and artistic journey',
                            link: '/blog',
                        },
                    ].map((item, idx) => (
                        <Link key={idx} href={item.link} className="group relative bg-white p-12 h-96 flex flex-col justify-between hover:bg-gray-100 transition-colors">
                            <div>
                                <span className="text-6xl font-serif italic text-black/5 block mb-8 group-hover:text-[#6CD8D1]/40 transition-colors">0{idx + 1}</span>
                                <h3 className="text-2xl font-light mb-4 group-hover:text-[#6CD8D1] transition-colors">{item.title}</h3>
                                <p className="text-black/40 text-sm leading-relaxed font-light max-w-[200px]">{item.description}</p>
                            </div>
                            <div className="flex justify-end">
                                <ArrowUpRight size={24} className="text-black/20 group-hover:text-[#6CD8D1] group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
