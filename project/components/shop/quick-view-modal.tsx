'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowUpRight, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { useCart } from '@/lib/cart-context';

interface QuickViewModalProps {
    isOpen: boolean;
    onClose: () => void;
    product: any;
}

export function QuickViewModal({ isOpen, onClose, product }: QuickViewModalProps) {
    const { addItem } = useCart();
    const [added, setAdded] = useState(false);

    if (!product) return null;

    const handleAddToCart = () => {
        addItem({
            id: product._id,
            title: product.title,
            price: product.price,
            image: product.images?.[0] || '',
        });
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl bg-white rounded-2xl shadow-2xl z-50 overflow-hidden m-4 max-h-[90vh] overflow-y-auto"
                    >
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 p-2 rounded-full bg-black/5 hover:bg-black/10 transition-colors z-10"
                        >
                            <X size={20} />
                        </button>

                        <div className="grid md:grid-cols-2">
                            {/* Image */}
                            <div className="bg-black/5 aspect-[4/5] md:aspect-auto md:h-full relative">
                                {product.images?.[0] ? (
                                    <img
                                        src={product.images[0]}
                                        alt={product.title}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <span className="text-4xl text-black/10">CM</span>
                                    </div>
                                )}
                            </div>

                            {/* Content */}
                            <div className="p-8 md:p-12 flex flex-col justify-center">
                                <span className="text-xs tracking-[0.2em] uppercase text-black/40 mb-4">{product.category}</span>
                                <h2 className="text-3xl font-light mb-4">{product.title}</h2>
                                <p className="text-black/60 font-light mb-8 line-clamp-4">{product.description}</p>

                                <div className="text-2xl font-light mb-8">Rs. {product.price.toLocaleString()}</div>

                                <div className="space-y-4">
                                    <button
                                        onClick={handleAddToCart}
                                        disabled={product.status === 'sold'}
                                        className="w-full py-4 bg-black text-white rounded-xl font-medium hover:bg-black/90 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <ShoppingBag size={18} />
                                        {product.status === 'sold' ? 'Sold Out' : added ? 'Added to Cart' : 'Add to Cart'}
                                    </button>

                                    <Link
                                        href={`/shop/${product._id}`}
                                        className="w-full py-4 border border-black/10 text-black rounded-xl font-medium hover:bg-black/5 transition-all flex items-center justify-center gap-2"
                                    >
                                        View Full Details
                                        <ArrowUpRight size={18} />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
