'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Loader2, X, ArrowUpRight, ArrowDown } from 'lucide-react';
import { PageHeader } from '@/components/page-header';
import { OptimizedImage } from '@/components/OptimizedImage';
import { motion, AnimatePresence } from 'framer-motion';

interface Image {
    _id: string;
    imageUrl: string;
    title: string;
    category: string;
}

interface GalleryPageContentProps {
    initialImages: Image[];
}

const ITEMS_PER_PAGE = 12;

export default function GalleryPageContent({ initialImages }: GalleryPageContentProps) {
    const [images, setImages] = useState<Image[]>(initialImages);
    const [loading, setLoading] = useState(initialImages.length === 0);
    const [selectedImage, setSelectedImage] = useState<Image | null>(null);
    const [filter, setFilter] = useState('all');

    // Pagination state
    const [page, setPage] = useState(1);

    useEffect(() => {
        // Only fetch if no initial images were provided
        if (initialImages.length === 0) {
            const fetchImages = async () => {
                try {
                    const res = await fetch('/api/images/list');
                    if (res.ok) {
                        const data = await res.json();
                        setImages(data);
                    }
                } catch (error) {
                    console.error('Error fetching images:', error);
                } finally {
                    setLoading(false);
                }
            };
            fetchImages();
        }
    }, [initialImages.length]);

    const categories = ['all', ...Array.from(new Set(images.map(img => img.category)))];
    const filteredImages = filter === 'all' ? images : images.filter(img => img.category === filter);

    // Pagination logic
    const totalPages = Math.ceil(filteredImages.length / ITEMS_PER_PAGE);
    const displayedImages = filteredImages.slice(0, page * ITEMS_PER_PAGE);

    // Reset pagination when filter changes
    useEffect(() => {
        setPage(1);
    }, [filter]);

    // Handle keyboard navigation for lightbox
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && selectedImage) {
                setSelectedImage(null);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedImage]);

    return (
        <div className="min-h-screen bg-[#0a0a0a]">
            {/* Navigation */}
            <PageHeader title="Gallery" />

            {/* Hero Header */}
            <section className="pt-32 pb-20 px-6 lg:px-12 relative overflow-hidden">
                <div className="absolute inset-0">
                    <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-gradient-to-r from-violet-500/5 to-purple-500/5 rounded-full blur-3xl" />
                </div>
                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="inline-flex items-center gap-3 mb-6">
                        <div className="w-12 h-[1px] bg-gradient-to-r from-transparent to-white/40" />
                        <span className="text-xs tracking-[0.3em] uppercase text-white/40">Curated Works</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-extralight text-white mb-6">
                        The <span className="font-medium">Gallery</span>
                    </h1>
                    <p className="text-lg text-white/40 max-w-xl font-light">
                        A curated collection of artwork spanning various mediums, styles, and emotional landscapes.
                    </p>
                </div>
            </section>

            {/* Filter Tabs */}
            {categories.length > 1 && (
                <div className="px-6 lg:px-12 pb-12">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex flex-wrap gap-3">
                            {categories.map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setFilter(cat)}
                                    className={`px-5 py-2 rounded-full text-sm transition-all ${filter === cat
                                        ? 'bg-white text-black'
                                        : 'border border-white/10 text-white/60 hover:border-white/20 hover:text-white'
                                        }`}
                                >
                                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Gallery Grid */}
            <section className="px-6 lg:px-12 pb-32">
                <div className="max-w-7xl mx-auto">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-32">
                            <Loader2 className="h-8 w-8 animate-spin text-white/40 mb-4" />
                            <span className="text-white/40 text-sm">Loading collection...</span>
                        </div>
                    ) : filteredImages.length === 0 ? (
                        <div className="text-center py-32">
                            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/[0.03] border border-white/[0.05] mb-6">
                                <span className="text-3xl font-light text-white/20">CM</span>
                            </div>
                            <h3 className="text-2xl font-light text-white mb-3">Gallery Coming Soon</h3>
                            <p className="text-white/40 mb-8">We are preparing something beautiful for you.</p>
                            <Link href="/subscribe" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black rounded-full font-medium hover:bg-white/90 transition-all">
                                Get Notified
                                <ArrowUpRight size={16} />
                            </Link>
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {displayedImages.map((img, idx) => (
                                    <motion.button
                                        key={img._id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.5, delay: (idx % ITEMS_PER_PAGE) * 0.1 }}
                                        onClick={() => setSelectedImage(img)}
                                        className="group relative aspect-[4/5] rounded-2xl overflow-hidden border border-white/[0.05] hover:border-white/[0.1] transition-all w-full text-left"
                                        aria-label={`View ${img.title}`}
                                    >
                                        <OptimizedImage
                                            src={img.imageUrl}
                                            alt={img.title}
                                            fill
                                            className="group-hover:scale-105 transition-transform duration-700"
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                        />
                                        {/* Overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            <div className="absolute bottom-0 left-0 right-0 p-6">
                                                <span className="text-xs tracking-[0.2em] uppercase text-white/50 block mb-2">{img.category}</span>
                                                <h3 className="text-xl font-light text-white">{img.title}</h3>
                                            </div>
                                        </div>
                                        {/* Number */}
                                        <div className="absolute top-4 right-4 text-white/10 text-sm font-light z-10">
                                            {String(idx + 1).padStart(2, '0')}
                                        </div>
                                    </motion.button>
                                ))}
                            </div>

                            {/* Load More Button */}
                            {page < totalPages && (
                                <div className="mt-16 flex justify-center">
                                    <button
                                        onClick={() => setPage(p => p + 1)}
                                        className="group flex flex-col items-center gap-2 text-white/40 hover:text-white transition-colors"
                                    >
                                        <span className="text-sm tracking-[0.2em] uppercase">Load More</span>
                                        <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-white/5 transition-all">
                                            <ArrowDown size={16} className="animate-bounce" />
                                        </div>
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </section>

            {/* Lightbox */}
            <AnimatePresence>
                {selectedImage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 bg-black/98 z-50 flex items-center justify-center p-4"
                        onClick={() => setSelectedImage(null)}
                        role="dialog"
                        aria-modal="true"
                        aria-label={selectedImage.title}
                    >
                        <button
                            onClick={() => setSelectedImage(null)}
                            className="absolute top-6 right-6 p-3 z-50 rounded-full border border-white/10 text-white/60 hover:text-white hover:border-white/20 transition-all"
                            aria-label="Close lightbox"
                        >
                            <X size={20} />
                        </button>
                        <div
                            className="max-w-5xl w-full max-h-[85vh] flex flex-col relative"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="relative w-full h-[60vh] md:h-[70vh]">
                                <OptimizedImage
                                    src={selectedImage.imageUrl}
                                    alt={selectedImage.title}
                                    fill
                                    className="object-contain"
                                    priority
                                    sizes="100vw"
                                />
                            </div>
                            <div className="mt-8 text-center">
                                <span className="text-xs tracking-[0.3em] uppercase text-white/40 block mb-2">{selectedImage.category}</span>
                                <h2 className="text-3xl font-light text-white">{selectedImage.title}</h2>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Footer CTA */}
            <section className="border-t border-white/[0.05] py-20 px-6 lg:px-12">
                <div className="max-w-7xl mx-auto text-center">
                    <h2 className="text-3xl font-light text-white mb-4">
                        Interested in a piece?
                    </h2>
                    <p className="text-white/40 mb-8 font-light">
                        Explore our collection available for purchase
                    </p>
                    <Link href="/shop" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-black rounded-full font-medium hover:bg-white/90 transition-all">
                        View Collection
                        <ArrowUpRight size={16} />
                    </Link>
                </div>
            </section>
        </div>
    );
}

