'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/page-header';

export default function AboutPage() {
    const fadeInUp = {
        hidden: { opacity: 0, y: 40 },
        visible: (i: number) => ({
            opacity: 1,
            y: 0,
            transition: {
                delay: i * 0.1,
                duration: 0.6,
                ease: [0.215, 0.61, 0.355, 1] as const,
            },
        }),
    };

    const timeline = [
        { year: '1990', event: 'First exhibition in Colombo' },
        { year: '2005', event: 'International recognition at Singapore Art Fair' },
        { year: '2012', event: 'Solo exhibition "Colors of Sri Lanka"' },
        { year: '2018', event: 'Artist residency in Paris' },
        { year: '2023', event: 'Launch of online gallery' },
    ];

    const [portraitImage, setPortraitImage] = useState<string | null>(null);

    useEffect(() => {
        fetch('/api/images/list')
            .then(r => r.json())
            .then((images: Array<{ imageUrl?: string }>) => {
                if (Array.isArray(images) && images.length > 0) {
                    const img = images.find(i => i.imageUrl) || images[0];
                    if (img?.imageUrl) setPortraitImage(img.imageUrl);
                }
            })
            .catch(() => { });
    }, []);

    return (
        <div className="min-h-screen bg-white">
            <PageHeader title="About" />

            {/* Hero Section */}
            <section className="pt-32 pb-24 px-6 lg:px-12">
                <div className="max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
                        {/* Image */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8 }}
                            className="relative aspect-[3/4] bg-gray-100 rounded-sm overflow-hidden order-2 lg:order-1"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-[#6CD8D1]/10 to-transparent mix-blend-multiply z-10" />
                            {portraitImage ? (
                                <Image
                                    src={portraitImage}
                                    alt="Chandrika Maelge — Artist Portrait"
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 1024px) 100vw, 50vw"
                                />
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center bg-[#f8f7f5]">
                                    <div className="text-center">
                                        <div className="w-40 h-40 rounded-full border border-black/5 flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
                                            <span className="text-6xl font-serif italic text-black/20">CM</span>
                                        </div>
                                        <span className="text-black/30 text-sm tracking-[0.2em] uppercase">Artist Portrait</span>
                                    </div>
                                </div>
                            )}
                        </motion.div>

                        {/* Content */}
                        <div className="order-1 lg:order-2">
                            <motion.span
                                custom={0}
                                initial="hidden"
                                animate="visible"
                                variants={fadeInUp}
                                className="text-xs tracking-[0.3em] uppercase text-black/40 mb-6 block"
                            >
                                The Artist
                            </motion.span>
                            <motion.h1
                                custom={1}
                                initial="hidden"
                                animate="visible"
                                variants={fadeInUp}
                                className="text-5xl md:text-6xl font-light leading-tight mb-8 text-black"
                            >
                                Chandrika <span className="font-serif italic text-black/60">Maelge</span>
                            </motion.h1>
                            <motion.p
                                custom={2}
                                initial="hidden"
                                animate="visible"
                                variants={fadeInUp}
                                className="text-black/60 text-lg leading-relaxed mb-6 font-light"
                            >
                                Born and raised in the heart of Sri Lanka, Chandrika Maelge discovered her passion
                                for art at an early age. Drawing inspiration from the vibrant landscapes, rich
                                cultural heritage, and the everyday beauty of island life, she creates pieces that
                                speak to the soul.
                            </motion.p>
                            <motion.p
                                custom={3}
                                initial="hidden"
                                animate="visible"
                                variants={fadeInUp}
                                className="text-black/60 text-lg leading-relaxed mb-8 font-light"
                            >
                                Her work spans various mediums—from oil paintings that capture the golden light
                                of tropical sunsets to intricate mixed-media pieces that explore themes of
                                identity, nature, and the human experience. Each creation is a journey, inviting
                                the viewer to pause, reflect, and connect.
                            </motion.p>
                            <motion.div
                                custom={4}
                                initial="hidden"
                                animate="visible"
                                variants={fadeInUp}
                            >
                                <Link href="/gallery">
                                    <span className="group inline-flex items-center gap-2 text-lg text-black hover:text-black/60 transition-colors border-b border-black/20 pb-1">
                                        Explore the Gallery
                                        <ArrowUpRight size={18} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                    </span>
                                </Link>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Philosophy Section */}
            <section className="py-24 px-6 lg:px-12 border-t border-black/[0.05] bg-black/[0.02]">
                <div className="max-w-4xl mx-auto text-center">
                    <motion.span
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="text-xs tracking-[0.3em] uppercase text-black/40 mb-8 block"
                    >
                        Philosophy
                    </motion.span>
                    <motion.blockquote
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-3xl md:text-4xl font-light leading-relaxed text-black/80 font-serif italic"
                    >
                        "Art is not what I see, but what I make others see. Each brushstroke is a word,
                        each canvas a story waiting to be told."
                    </motion.blockquote>
                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-black/40 mt-8"
                    >
                        — Chandrika Maelge
                    </motion.p>
                </div>
            </section>

            {/* Timeline Section */}
            <section className="py-24 px-6 lg:px-12 bg-white">
                <div className="max-w-5xl mx-auto">
                    <motion.span
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="text-xs tracking-[0.3em] uppercase text-black/40 mb-12 block text-center"
                    >
                        Journey
                    </motion.span>

                    <div className="space-y-8">
                        {timeline.map((item, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className="flex items-center gap-8 group"
                            >
                                <span className="text-4xl font-light text-black/20 group-hover:text-black/40 transition-colors w-24 flex-shrink-0">
                                    {item.year}
                                </span>
                                <div className="w-3 h-3 rounded-full border border-black/10 bg-white flex-shrink-0 group-hover:bg-[#6CD8D1] transition-colors" />
                                <p className="text-black/60 text-lg font-light group-hover:text-black/80 transition-colors">
                                    {item.event}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-32 px-6 lg:px-12 border-t border-black/[0.05]">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-4xl md:text-5xl font-light mb-6 text-black">
                        Interested in a <span className="font-serif italic text-black/60">Commission</span>?
                    </h2>
                    <p className="text-black/40 text-lg mb-12 font-light max-w-xl mx-auto">
                        Create a bespoke piece tailored to your vision. Let's bring your artistic dreams to life.
                    </p>
                    <Link href="/contact">
                        <span className="group inline-flex items-center gap-4 px-10 py-5 bg-black text-white rounded-full text-lg font-medium hover:bg-black/80 transition-all">
                            Get in Touch
                            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        </span>
                    </Link>
                </div>
            </section>
        </div>
    );
}
