'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Plus, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/lib/cart-context';

export function CartDrawer() {
    const { items, isOpen, closeCart, removeItem, updateQuantity, totalPrice, totalItems } = useCart();

    // Format price in LKR
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-LK', {
            style: 'currency',
            currency: 'LKR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(price);
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
                        onClick={closeCart}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                        className="fixed right-0 top-0 h-full w-full max-w-md bg-[#0a0a0a] border-l border-white/10 z-50 flex flex-col"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-white/10">
                            <div className="flex items-center gap-3">
                                <ShoppingBag className="w-5 h-5 text-white/60" />
                                <h2 className="text-lg font-light text-white">
                                    Your Cart <span className="text-white/40">({totalItems})</span>
                                </h2>
                            </div>
                            <button
                                onClick={closeCart}
                                className="p-2 hover:bg-white/5 rounded-full transition-colors"
                            >
                                <X className="w-5 h-5 text-white/60" />
                            </button>
                        </div>

                        {/* Cart Items */}
                        <div className="flex-1 overflow-y-auto p-6">
                            {items.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-center">
                                    <ShoppingBag className="w-16 h-16 text-white/10 mb-4" />
                                    <p className="text-white/40 font-light mb-6">Your cart is empty</p>
                                    <button
                                        onClick={closeCart}
                                        className="text-white hover:text-white/70 transition-colors underline underline-offset-4"
                                    >
                                        Continue shopping
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {items.map((item) => (
                                        <motion.div
                                            key={item.id}
                                            layout
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -20 }}
                                            className="flex gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/[0.05]"
                                        >
                                            {/* Image */}
                                            <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-white/5 flex-shrink-0">
                                                {item.image ? (
                                                    <Image
                                                        src={item.image}
                                                        alt={item.title}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center">
                                                        <span className="text-2xl font-serif italic text-white/20">CM</span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Details */}
                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-white font-light truncate">{item.title}</h3>
                                                <p className="text-white/60 text-sm mt-1">{formatPrice(item.price)}</p>

                                                {/* Quantity Controls */}
                                                <div className="flex items-center gap-3 mt-3">
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                        className="w-7 h-7 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/5 transition-colors"
                                                    >
                                                        <Minus className="w-3 h-3 text-white/60" />
                                                    </button>
                                                    <span className="text-white/80 w-6 text-center">{item.quantity}</span>
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                        className="w-7 h-7 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/5 transition-colors"
                                                    >
                                                        <Plus className="w-3 h-3 text-white/60" />
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Remove */}
                                            <button
                                                onClick={() => removeItem(item.id)}
                                                className="p-2 hover:bg-red-500/10 rounded-full transition-colors self-start"
                                            >
                                                <Trash2 className="w-4 h-4 text-white/40 hover:text-red-400" />
                                            </button>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        {items.length > 0 && (
                            <div className="p-6 border-t border-white/10 bg-[#050505]">
                                <div className="flex items-center justify-between mb-6">
                                    <span className="text-white/60 font-light">Subtotal</span>
                                    <span className="text-xl text-white font-light">{formatPrice(totalPrice)}</span>
                                </div>
                                <Link
                                    href="/checkout"
                                    onClick={closeCart}
                                    className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-white text-black rounded-xl font-medium hover:bg-white/90 transition-all"
                                >
                                    Proceed to Checkout
                                    <ArrowRight className="w-4 h-4" />
                                </Link>
                                <p className="text-white/30 text-xs text-center mt-4">
                                    Shipping calculated at checkout
                                </p>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

// Cart button component for navbar
export function CartButton() {
    const { totalItems, openCart } = useCart();

    return (
        <button
            onClick={openCart}
            className="relative p-2 hover:bg-white/5 rounded-full transition-colors"
            aria-label="Open cart"
        >
            <ShoppingBag className="w-5 h-5 text-white/60" />
            {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-white text-black text-xs font-medium rounded-full flex items-center justify-center">
                    {totalItems > 9 ? '9+' : totalItems}
                </span>
            )}
        </button>
    );
}
