'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Loader2, Check, ArrowUpRight, ShoppingBag, Share2, Copy, CheckCircle } from 'lucide-react';
import { PageHeader } from '@/components/page-header';
import { useCart } from '@/lib/cart-context';
import { ViewInRoomModal } from '@/components/shop/view-in-room-modal';
import { ImageZoom } from '@/components/ui/image-zoom';
import { motion } from 'framer-motion';
import { OptimizedImage } from '@/components/OptimizedImage';

interface Variant {
    type: string;
    price: number;
    dimensions?: string;
    material?: string;
}

interface Product {
    _id: string;
    title: string;
    description: string;
    price: number;
    category: string;
    images: string[];
    status: 'available' | 'sold';
    dimensions?: { width?: number; height?: number; depth?: number };
    variants?: Variant[];
    hasPrints?: boolean;
}

interface ProductPageContentProps {
    product: Product;
}

export default function ProductPageContent({ product }: ProductPageContentProps) {
    const [mainImage, setMainImage] = useState(product.images?.[0] || '');
    const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
    const [viewInRoomOpen, setViewInRoomOpen] = useState(false);

    // Order Form State
    const [orderName, setOrderName] = useState('');
    const [orderEmail, setOrderEmail] = useState('');
    const [orderMessage, setOrderMessage] = useState('');
    const [orderSubmitting, setOrderSubmitting] = useState(false);
    const [orderSuccess, setOrderSuccess] = useState(false);

    const [copied, setCopied] = useState(false);
    const [addedToCart, setAddedToCart] = useState(false);
    const { addItem } = useCart();

    // Determine current price based on selection
    const currentPrice = selectedVariant ? selectedVariant.price : product.price;

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
                    variant: selectedVariant ? selectedVariant.type : 'Original',
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
        const itemTitle = selectedVariant
            ? `${product.title} - ${selectedVariant.type}`
            : product.title;

        addItem({
            id: selectedVariant ? `${product._id}-${selectedVariant.type}` : product._id, // Unique ID for variant
            title: itemTitle,
            price: currentPrice,
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
        <div className="min-h-screen bg-white">
            {/* Navigation */}
            <PageHeader title="Artwork" backHref="/shop" backLabel="Gift Shop" />

            {/* Product Details */}
            <section className="pt-32 pb-20 px-6 lg:px-12">
                <div className="max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
                        {/* Images */}
                        <div className="space-y-4">
                            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-black/[0.02]">
                                {mainImage ? (
                                    <>
                                        <ImageZoom src={mainImage} alt={product.title} />
                                        <button
                                            onClick={() => setViewInRoomOpen(true)}
                                            className="absolute bottom-4 right-4 px-4 py-2 bg-white/90 backdrop-blur-md text-black text-sm font-medium rounded-full shadow-sm hover:scale-105 transition-transform flex items-center gap-2 z-20"
                                        >
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18" /><path d="M9 3v18" /><path d="M15 9h6" /><path d="M21 3l-6 6" /></svg>
                                            View in Room
                                        </button>
                                    </>
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <span className="text-6xl font-light text-black/10">CM</span>
                                    </div>
                                )}
                            </div>

                            {product.images?.length > 1 && (
                                <div className="flex gap-3 overflow-x-auto pb-2">
                                    {product.images.map((img, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setMainImage(img)}
                                            className={`relative h-20 w-20 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 ${mainImage === img
                                                ? 'border-black'
                                                : 'border-black/[0.05] hover:border-black/20'
                                                }`}
                                        >
                                            <OptimizedImage
                                                src={img}
                                                alt={`${product.title} ${idx + 1}`}
                                                fill
                                                className="object-cover"
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Info Column - Sticky */}
                        <div className="space-y-8 lg:sticky lg:top-32 h-fit">
                            {/* Header */}
                            <div>
                                <span className="text-xs tracking-[0.3em] uppercase text-black/40 block mb-4">
                                    {product.category}
                                </span>
                                <h1 className="text-5xl md:text-6xl font-light font-serif text-black mb-6 leading-tight">
                                    {product.title}
                                </h1>

                                <div className="flex items-center gap-4 border-b border-black/5 pb-8">
                                    <span className="text-3xl font-light text-black">
                                        {formatPrice(currentPrice)}
                                    </span>
                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs uppercase tracking-wider ${product.status === 'available'
                                        ? 'bg-emerald-500/5 text-emerald-600 border border-emerald-500/20'
                                        : 'bg-black/5 text-black/40 border border-black/10'
                                        }`}>
                                        <span className={`w-1.5 h-1.5 rounded-full ${product.status === 'available' ? 'bg-emerald-500' : 'bg-black/40'}`} />
                                        {product.status === 'available' ? 'Available' : 'Sold'}
                                    </span>
                                </div>
                            </div>

                            {/* Description */}
                            <div className="prose prose-neutral prose-sm max-w-none">
                                <p className="text-black/60 leading-relaxed font-light whitespace-pre-wrap text-base">
                                    {product.description}
                                </p>
                            </div>

                            {/* Buying Options */}
                            {product.variants && product.variants.length > 0 && (
                                <div className="space-y-4 pt-4">
                                    <h3 className="text-xs tracking-[0.2em] uppercase text-black/40">Select Format</h3>

                                    {/* Original Option */}
                                    <button
                                        onClick={() => setSelectedVariant(null)}
                                        className={`group w-full text-left p-6 rounded-2xl border-2 transition-all duration-300 relative overflow-hidden ${selectedVariant === null
                                            ? 'border-black bg-black/[0.02]'
                                            : 'border-black/[0.05] hover:border-black/20 hover:bg-black/[0.01]'
                                            }`}
                                    >
                                        <div className="flex justify-between items-start mb-2 relative z-10">
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="font-medium text-lg text-black">Original Painting</span>
                                                    {selectedVariant === null && (
                                                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                                                            <CheckCircle size={18} className="text-black" />
                                                        </motion.div>
                                                    )}
                                                </div>
                                                <div className="text-sm text-black/50 font-light">
                                                    One-of-a-kind piece • Signed by Artist
                                                </div>
                                            </div>
                                            <span className="text-lg font-medium text-black">{formatPrice(product.price)}</span>
                                        </div>
                                        {product.dimensions && (
                                            <div className="inline-block px-2 py-1 bg-white rounded-md text-xs text-black/60 border border-black/5">
                                                {product.dimensions.width} x {product.dimensions.height} cm
                                            </div>
                                        )}
                                        {selectedVariant === null && (
                                            <motion.div
                                                layoutId="active-glow"
                                                className="absolute inset-0 bg-gradient-to-r from-black/[0.03] to-transparent pointer-events-none"
                                            />
                                        )}
                                    </button>

                                    {/* Canvas Option */}
                                    {product.variants.map((variant, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setSelectedVariant(variant)}
                                            className={`group w-full text-left p-6 rounded-2xl border-2 transition-all duration-300 relative overflow-hidden ${selectedVariant === variant
                                                ? 'border-[#6CD8D1] bg-[#6CD8D1]/5'
                                                : 'border-black/[0.05] hover:border-black/20 hover:bg-black/[0.01]'
                                                }`}
                                        >
                                            <div className="flex justify-between items-start mb-2 relative z-10">
                                                <div>
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className="font-medium text-lg text-black">{variant.type}</span>
                                                        {selectedVariant === variant && (
                                                            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                                                                <CheckCircle size={18} className="text-[#6CD8D1]" />
                                                            </motion.div>
                                                        )}
                                                    </div>
                                                    <div className="text-sm text-black/50 font-light">
                                                        Museum Quality Canvas • Archival Inks
                                                    </div>
                                                </div>
                                                <span className="text-lg font-medium text-black">{formatPrice(variant.price)}</span>
                                            </div>
                                            <div className="inline-block px-2 py-1 bg-white rounded-md text-xs text-black/60 border border-black/5">
                                                {variant.dimensions}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            )}

                            {/* Add to Cart */}
                            {product.status === 'available' && (
                                <div className="flex gap-4 pt-6">
                                    <button
                                        onClick={handleAddToCart}
                                        disabled={addedToCart}
                                        className={`flex-1 h-16 rounded-full font-medium transition-all duration-300 flex items-center justify-center gap-3 text-lg shadow-lg hover:shadow-xl hover:-translate-y-1 ${addedToCart
                                            ? 'bg-emerald-500 text-white'
                                            : 'bg-black text-white hover:bg-gray-900'
                                            }`}
                                    >
                                        {addedToCart ? (
                                            <>
                                                <CheckCircle className="w-6 h-6" />
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
                                        className="h-16 w-16 rounded-full border border-black/10 text-black/60 hover:bg-black/5 hover:text-black transition-all flex items-center justify-center hover:scale-105 active:scale-95"
                                        title="Share Artwork"
                                    >
                                        {copied ? <Check className="w-6 h-6 text-emerald-500" /> : <Share2 className="w-6 h-6" />}
                                    </button>
                                </div>
                            )}

                            {/* Trust Badges */}
                            <div className="grid grid-cols-3 gap-4 pt-8 border-t border-black/5">
                                <div className="text-center space-y-2">
                                    <div className="w-10 h-10 mx-auto bg-black/[0.03] rounded-full flex items-center justify-center text-black/60">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                                    </div>
                                    <p className="text-xs uppercase tracking-wider text-black/40">Secure<br />Payment</p>
                                </div>
                                <div className="text-center space-y-2">
                                    <div className="w-10 h-10 mx-auto bg-black/[0.03] rounded-full flex items-center justify-center text-black/60">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4M16.5 9.4 7.55 4.24" /></svg>
                                    </div>
                                    <p className="text-xs uppercase tracking-wider text-black/40">Safe<br />Shipping</p>
                                </div>
                                <div className="text-center space-y-2">
                                    <div className="w-10 h-10 mx-auto bg-black/[0.03] rounded-full flex items-center justify-center text-black/60">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10" /><path d="m9 12 2 2 4-4" /></svg>
                                    </div>
                                    <p className="text-xs uppercase tracking-wider text-black/40">Authentic<br />Artwork</p>
                                </div>
                            </div>


                            {/* Order Form */}
                            {product.status === 'available' && (
                                <div className="border-t border-black/[0.05] pt-8">
                                    <h3 className="text-xs tracking-[0.2em] uppercase text-black/40 mb-6">Inquire About This Piece</h3>

                                    {orderSuccess ? (
                                        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6 text-center">
                                            <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-4">
                                                <Check className="w-6 h-6 text-emerald-500" />
                                            </div>
                                            <h4 className="text-lg font-light text-black mb-2">Inquiry Sent</h4>
                                            <p className="text-black/40 text-sm">We will contact you shortly about this artwork.</p>
                                        </div>
                                    ) : (
                                        <form onSubmit={handleOrderSubmit} className="space-y-4">
                                            <div className="grid sm:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm text-black/60 mb-2">Name</label>
                                                    <input
                                                        type="text"
                                                        value={orderName}
                                                        onChange={(e) => setOrderName(e.target.value)}
                                                        required
                                                        className="w-full px-4 py-3 rounded-xl bg-black/[0.03] border border-black/[0.08] text-black placeholder-black/30 focus:outline-none focus:border-black/20 transition-all"
                                                        placeholder="Your name"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm text-black/60 mb-2">Email</label>
                                                    <input
                                                        type="email"
                                                        value={orderEmail}
                                                        onChange={(e) => setOrderEmail(e.target.value)}
                                                        required
                                                        className="w-full px-4 py-3 rounded-xl bg-black/[0.03] border border-black/[0.08] text-black placeholder-black/30 focus:outline-none focus:border-black/20 transition-all"
                                                        placeholder="your@email.com"
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-sm text-black/60 mb-2">Message (optional)</label>
                                                <textarea
                                                    value={orderMessage}
                                                    onChange={(e) => setOrderMessage(e.target.value)}
                                                    rows={3}
                                                    className="w-full px-4 py-3 rounded-xl bg-black/[0.03] border border-black/[0.08] text-black placeholder-black/30 focus:outline-none focus:border-black/20 transition-all resize-none"
                                                    placeholder="Any questions or details about your interest?"
                                                />
                                            </div>
                                            <button
                                                type="submit"
                                                disabled={orderSubmitting}
                                                className="w-full px-6 py-4 bg-black text-white rounded-xl font-medium hover:bg-black/90 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
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
            <section className="border-t border-black/[0.05] py-20 px-6 lg:px-12">
                <div className="max-w-7xl mx-auto text-center">
                    <h2 className="text-2xl font-light text-black mb-4">
                        Explore More Artworks
                    </h2>
                    <Link href="/shop" className="inline-flex items-center gap-2 px-6 py-3 border border-black/20 text-black rounded-full font-light hover:bg-black/5 transition-all">
                        View Full Gift Shop
                        <ArrowUpRight size={16} />
                    </Link>
                </div>
            </section>

            <ViewInRoomModal
                isOpen={viewInRoomOpen}
                onClose={() => setViewInRoomOpen(false)}
                image={mainImage}
            />
        </div>
    );
}
