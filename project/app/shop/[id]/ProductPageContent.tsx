'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Loader2, Check, ArrowUpRight, ShoppingBag, Share2, Copy, CheckCircle } from 'lucide-react';
import { PageHeader } from '@/components/page-header';
import { useCart } from '@/lib/cart-context';

interface Product {
    _id: string;
    title: string;
    description: string;
    price: number;
    category: string;
    images: string[];
    status: 'available' | 'sold';
    dimensions?: { width?: number; height?: number; depth?: number };
}

interface ProductPageContentProps {
    product: Product;
}

export default function ProductPageContent({ product }: ProductPageContentProps) {
    const [mainImage, setMainImage] = useState(product.images?.[0] || '');
    const [orderName, setOrderName] = useState('');
    const [orderEmail, setOrderEmail] = useState('');
    const [orderMessage, setOrderMessage] = useState('');
    const [orderSubmitting, setOrderSubmitting] = useState(false);
    const [orderSuccess, setOrderSuccess] = useState(false);
    const [copied, setCopied] = useState(false);
    const [addedToCart, setAddedToCart] = useState(false);
    const { addItem } = useCart();

    // Format price in LKR
    const formatPrice = (price: number) => {
        return `Rs. ${price.toLocaleString()}`;
    };

    const handleOrderSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setOrderSubmitting(true);

        try {
            const res = await fetch('/api/shop/order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    product: product._id,
                    name: orderName,
                    email: orderEmail,
                    message: orderMessage,
                }),
            });

            if (res.ok) {
                setOrderSuccess(true);
                setOrderName('');
                setOrderEmail('');
                setOrderMessage('');
            }
        } catch (error) {
            alert('Error submitting inquiry');
        } finally {
            setOrderSubmitting(false);
        }
    };

    const handleAddToCart = () => {
        addItem({
            id: product._id,
            title: product.title,
            price: product.price,
            image: product.images?.[0] || '',
        });
        setAddedToCart(true);
        setTimeout(() => setAddedToCart(false), 2000);
    };

    const handleShare = async () => {
        const url = typeof window !== 'undefined' ? window.location.href : '';
        try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a]">
            {/* Navigation */}
            <PageHeader title="Artwork" backHref="/shop" backLabel="Collection" />

            {/* Product Details */}
            <section className="pt-32 pb-20 px-6 lg:px-12">
                <div className="max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
                        {/* Images */}
                        <div className="space-y-4">
                            <div className="aspect-[4/5] rounded-2xl overflow-hidden border border-white/[0.05] bg-white/[0.02]">
                                {mainImage ? (
                                    <img
                                        src={mainImage}
                                        alt={product.title}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <span className="text-6xl font-light text-white/10">CM</span>
                                    </div>
                                )}
                            </div>

                            {product.images?.length > 1 && (
                                <div className="flex gap-3 overflow-x-auto pb-2">
                                    {product.images.map((img, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setMainImage(img)}
                                            className={`h-20 w-20 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 ${mainImage === img
                                                ? 'border-white'
                                                : 'border-white/[0.05] hover:border-white/20'
                                                }`}
                                        >
                                            <img
                                                src={img}
                                                alt={`${product.title} ${idx + 1}`}
                                                className="w-full h-full object-cover"
                                                loading="lazy"
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Info */}
                        <div className="space-y-8">
                            {/* Header */}
                            <div>
                                <span className="text-xs tracking-[0.3em] uppercase text-white/40 block mb-3">
                                    {product.category}
                                </span>
                                <h1 className="text-4xl md:text-5xl font-extralight text-white mb-6">
                                    {product.title}
                                </h1>

                                <div className="flex items-center gap-4">
                                    <span className="text-3xl font-light text-white">
                                        {formatPrice(product.price)}
                                    </span>
                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs ${product.status === 'available'
                                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                        : 'bg-white/5 text-white/40 border border-white/10'
                                        }`}>
                                        <span className={`w-1.5 h-1.5 rounded-full ${product.status === 'available' ? 'bg-emerald-400' : 'bg-white/40'}`} />
                                        {product.status === 'available' ? 'Available' : 'Sold'}
                                    </span>
                                </div>
                            </div>

                            {/* Add to Cart & Share */}
                            {product.status === 'available' && (
                                <div className="flex gap-3">
                                    <button
                                        onClick={handleAddToCart}
                                        disabled={addedToCart}
                                        className={`flex-1 px-6 py-4 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${addedToCart
                                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                            : 'bg-white text-black hover:bg-white/90'
                                            }`}
                                    >
                                        {addedToCart ? (
                                            <>
                                                <CheckCircle className="w-5 h-5" />
                                                Added to Cart
                                            </>
                                        ) : (
                                            <>
                                                <ShoppingBag className="w-5 h-5" />
                                                Add to Cart
                                            </>
                                        )}
                                    </button>
                                    <button
                                        onClick={handleShare}
                                        className="px-4 py-4 rounded-xl border border-white/10 text-white/60 hover:bg-white/5 hover:text-white transition-all"
                                        title="Copy link"
                                    >
                                        {copied ? <Check className="w-5 h-5 text-emerald-400" /> : <Share2 className="w-5 h-5" />}
                                    </button>
                                </div>
                            )}

                            {/* Description */}
                            <div className="border-t border-white/[0.05] pt-8">
                                <h3 className="text-xs tracking-[0.2em] uppercase text-white/40 mb-4">About This Piece</h3>
                                <p className="text-white/60 leading-relaxed font-light whitespace-pre-wrap">
                                    {product.description}
                                </p>
                            </div>

                            {/* Dimensions */}
                            {product.dimensions && (
                                <div className="border-t border-white/[0.05] pt-8">
                                    <h3 className="text-xs tracking-[0.2em] uppercase text-white/40 mb-4">Dimensions</h3>
                                    <div className="flex gap-6">
                                        {product.dimensions.width && (
                                            <div>
                                                <span className="text-white font-light">{product.dimensions.width}</span>
                                                <span className="text-white/40 text-sm ml-1">cm W</span>
                                            </div>
                                        )}
                                        {product.dimensions.height && (
                                            <div>
                                                <span className="text-white font-light">{product.dimensions.height}</span>
                                                <span className="text-white/40 text-sm ml-1">cm H</span>
                                            </div>
                                        )}
                                        {product.dimensions.depth && (
                                            <div>
                                                <span className="text-white font-light">{product.dimensions.depth}</span>
                                                <span className="text-white/40 text-sm ml-1">cm D</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Order Form */}
                            {product.status === 'available' && (
                                <div className="border-t border-white/[0.05] pt-8">
                                    <h3 className="text-xs tracking-[0.2em] uppercase text-white/40 mb-6">Inquire About This Piece</h3>

                                    {orderSuccess ? (
                                        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6 text-center">
                                            <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-4">
                                                <Check className="w-6 h-6 text-emerald-400" />
                                            </div>
                                            <h4 className="text-lg font-light text-white mb-2">Inquiry Sent</h4>
                                            <p className="text-white/40 text-sm">We will contact you shortly about this artwork.</p>
                                        </div>
                                    ) : (
                                        <form onSubmit={handleOrderSubmit} className="space-y-4">
                                            <div className="grid sm:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm text-white/60 mb-2">Name</label>
                                                    <input
                                                        type="text"
                                                        value={orderName}
                                                        onChange={(e) => setOrderName(e.target.value)}
                                                        required
                                                        className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white placeholder-white/30 focus:outline-none focus:border-white/20 transition-all"
                                                        placeholder="Your name"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm text-white/60 mb-2">Email</label>
                                                    <input
                                                        type="email"
                                                        value={orderEmail}
                                                        onChange={(e) => setOrderEmail(e.target.value)}
                                                        required
                                                        className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white placeholder-white/30 focus:outline-none focus:border-white/20 transition-all"
                                                        placeholder="your@email.com"
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-sm text-white/60 mb-2">Message (optional)</label>
                                                <textarea
                                                    value={orderMessage}
                                                    onChange={(e) => setOrderMessage(e.target.value)}
                                                    rows={3}
                                                    className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white placeholder-white/30 focus:outline-none focus:border-white/20 transition-all resize-none"
                                                    placeholder="Any questions or details about your interest?"
                                                />
                                            </div>
                                            <button
                                                type="submit"
                                                disabled={orderSubmitting}
                                                className="w-full px-6 py-4 bg-white text-black rounded-xl font-medium hover:bg-white/90 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                                            >
                                                {orderSubmitting ? (
                                                    <>
                                                        <Loader2 className="h-5 w-5 animate-spin" />
                                                        Sending...
                                                    </>
                                                ) : (
                                                    <>
                                                        Send Inquiry
                                                        <ArrowUpRight size={16} />
                                                    </>
                                                )}
                                            </button>
                                        </form>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Related CTA */}
            <section className="border-t border-white/[0.05] py-20 px-6 lg:px-12">
                <div className="max-w-7xl mx-auto text-center">
                    <h2 className="text-2xl font-light text-white mb-4">
                        Explore More Artworks
                    </h2>
                    <Link href="/shop" className="inline-flex items-center gap-2 px-6 py-3 border border-white/20 text-white rounded-full font-light hover:bg-white/5 transition-all">
                        View Full Collection
                        <ArrowUpRight size={16} />
                    </Link>
                </div>
            </section>
        </div>
    );
}
