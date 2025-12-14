'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Loader2, ArrowUpRight } from 'lucide-react';
import { PageHeader } from '@/components/page-header';

interface Product {
    _id: string;
    title: string;
    description: string;
    price: number;
    category: string;
    images: string[];
    status: 'available' | 'sold';
}

interface ShopPageContentProps {
    initialProducts: Product[];
}

export default function ShopPageContent({ initialProducts }: ShopPageContentProps) {
    const [products, setProducts] = useState<Product[]>(initialProducts);
    const [loading, setLoading] = useState(initialProducts.length === 0);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        // Only fetch if no initial products were provided
        if (initialProducts.length === 0) {
            const fetchProducts = async () => {
                try {
                    const res = await fetch('/api/shop/products');
                    if (res.ok) {
                        const data = await res.json();
                        setProducts(data);
                    }
                } catch (error) {
                    console.error('Error fetching products:', error);
                } finally {
                    setLoading(false);
                }
            };
            fetchProducts();
        }
    }, [initialProducts.length]);

    const categories = ['all', ...Array.from(new Set(products.map(p => p.category)))];
    const filteredProducts = filter === 'all' ? products : products.filter(p => p.category === filter);

    // Format price in LKR
    const formatPrice = (price: number) => {
        return `Rs. ${price.toLocaleString()}`;
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a]">
            {/* Navigation */}
            <PageHeader title="Collection" />

            {/* Hero Header */}
            <section className="pt-32 pb-20 px-6 lg:px-12 relative overflow-hidden">
                <div className="absolute inset-0">
                    <div className="absolute top-1/4 right-1/3 w-[500px] h-[500px] bg-gradient-to-r from-emerald-500/5 to-teal-500/5 rounded-full blur-3xl" />
                </div>
                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="inline-flex items-center gap-3 mb-6">
                        <div className="w-12 h-[1px] bg-gradient-to-r from-transparent to-white/40" />
                        <span className="text-xs tracking-[0.3em] uppercase text-white/40">Available Works</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-extralight text-white mb-6">
                        The <span className="font-medium">Collection</span>
                    </h1>
                    <p className="text-lg text-white/40 max-w-xl font-light">
                        Original artworks and limited edition prints available for collectors and art enthusiasts.
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

            {/* Products Grid */}
            <section className="px-6 lg:px-12 pb-32">
                <div className="max-w-7xl mx-auto">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-32">
                            <Loader2 className="h-8 w-8 animate-spin text-white/40 mb-4" />
                            <span className="text-white/40 text-sm">Loading collection...</span>
                        </div>
                    ) : filteredProducts.length === 0 ? (
                        <div className="text-center py-32">
                            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/[0.03] border border-white/[0.05] mb-6">
                                <span className="text-3xl font-light text-white/20">✦</span>
                            </div>
                            <h3 className="text-2xl font-light text-white mb-3">Collection Coming Soon</h3>
                            <p className="text-white/40 mb-8">New pieces are being prepared for the collection.</p>
                            <Link href="/subscribe" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black rounded-full font-medium hover:bg-white/90 transition-all">
                                Get Notified
                                <ArrowUpRight size={16} />
                            </Link>
                        </div>
                    ) : (
                        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                            {filteredProducts.map((product, idx) => (
                                <Link key={product._id} href={`/shop/${product._id}`}>
                                    <article className="group rounded-2xl border border-white/[0.05] hover:border-white/[0.1] overflow-hidden transition-all">
                                        {/* Image */}
                                        <div className="relative aspect-[4/5] bg-white/[0.02] overflow-hidden">
                                            {product.images[0] ? (
                                                <img
                                                    src={product.images[0]}
                                                    alt={product.title}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                                    loading="lazy"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <span className="text-4xl font-light text-white/10">CM</span>
                                                </div>
                                            )}

                                            {/* Status Badge */}
                                            {product.status === 'sold' && (
                                                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                                    <span className="px-4 py-2 border border-white/20 text-white text-sm tracking-widest uppercase">
                                                        Sold
                                                    </span>
                                                </div>
                                            )}

                                            {/* Number */}
                                            <div className="absolute top-4 right-4 text-white/10 text-sm font-light">
                                                {String(idx + 1).padStart(2, '0')}
                                            </div>
                                        </div>

                                        {/* Info */}
                                        <div className="p-6">
                                            <span className="text-xs tracking-[0.2em] uppercase text-white/40 block mb-2">
                                                {product.category}
                                            </span>
                                            <h3 className="text-lg font-light text-white mb-3 group-hover:text-white/80 transition-colors line-clamp-1">
                                                {product.title}
                                            </h3>
                                            <p className="text-sm text-white/40 line-clamp-2 mb-4 font-light">
                                                {product.description}
                                            </p>

                                            {/* Price & CTA */}
                                            <div className="flex items-center justify-between pt-4 border-t border-white/[0.05]">
                                                <span className="text-xl font-light text-white">
                                                    {formatPrice(product.price)}
                                                </span>
                                                <span className="flex items-center gap-1 text-sm text-white/40 group-hover:text-white transition-colors">
                                                    View
                                                    <ArrowUpRight size={14} />
                                                </span>
                                            </div>
                                        </div>
                                    </article>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Commissions CTA */}
            <section className="border-t border-white/[0.05] py-20 px-6 lg:px-12">
                <div className="max-w-7xl mx-auto text-center">
                    <h2 className="text-3xl font-light text-white mb-4">
                        Looking for Something Unique?
                    </h2>
                    <p className="text-white/40 mb-8 font-light max-w-lg mx-auto">
                        Commission a bespoke artwork tailored to your vision and space
                    </p>
                    <Link href="/subscribe" className="inline-flex items-center gap-2 px-8 py-4 border border-white/20 text-white rounded-full font-light hover:bg-white/5 transition-all">
                        Inquire About Commissions
                        <ArrowUpRight size={16} />
                    </Link>
                </div>
            </section>
        </div>
    );
}
