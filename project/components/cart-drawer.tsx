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
                        className="fixed right-0 top-0 h-full w-full max-w-md bg-white border-l border-black/10 z-50 flex flex-col shadow-2xl"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-black/10">
                            <div className="flex items-center gap-3">
                                <ShoppingBag className="w-5 h-5 text-black/60" />
                                <h2 className="text-lg font-light text-black">
                                    Your Cart <span className="text-black/40">({totalItems})</span>
                                </h2>
                            </div>
                            <button
                                onClick={closeCart}
                                className="p-2 hover:bg-black/5 rounded-full transition-colors"
                            >
                                <X className="w-5 h-5 text-black/60" />
                            </button>
                        </div>

                        {/* Cart Items */}
                        <div className="flex-1 overflow-y-auto p-6">
                            {items.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-center">
                                    <ShoppingBag className="w-16 h-16 text-black/5 mb-4" />
                                    <p className="text-black/40 font-light mb-6">Your cart is empty</p>
                                    <button
                                        onClick={closeCart}
                                        className="text-black hover:text-black/70 transition-colors underline underline-offset-4"
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
                                            className="flex gap-4 p-4 rounded-xl bg-black/[0.02] border border-black/[0.05]"
                                        >
                                            {/* Image */}
                                            <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-black/5 flex-shrink-0">
                                                {item.image ? (
                                                    <Image
                                                        src={item.image}
                                                        alt={item.title}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center">
                                                        <span className="text-2xl font-serif italic text-black/20">CM</span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Details */}
                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-black font-light truncate">{item.title}</h3>
                                                <p className="text-black/60 text-sm mt-1">{formatPrice(item.price)}</p>

                                                {/* Quantity Controls */}
                                                <div className="flex items-center gap-3 mt-3">
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                        className="w-7 h-7 rounded-full border border-black/10 flex items-center justify-center hover:bg-black/5 transition-colors"
                                                    >
                                                        <Minus className="w-3 h-3 text-black/60" />
                                                    </button>
                                                    <span className="text-black/80 w-6 text-center">{item.quantity}</span>
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                        className="w-7 h-7 rounded-full border border-black/10 flex items-center justify-center hover:bg-black/5 transition-colors"
                                                    >
                                                        <Plus className="w-3 h-3 text-black/60" />
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Remove */}
                                            <button
                                                onClick={() => removeItem(item.id)}
                                                className="p-2 hover:bg-red-500/10 rounded-full transition-colors self-start"
                                            >
                                                <Trash2 className="w-4 h-4 text-black/40 hover:text-red-400" />
                                            </button>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        {items.length > 0 && (
                            <div className="p-6 border-t border-black/10 bg-white">
                                <div className="flex items-center justify-between mb-6">
                                    <span className="text-black/60 font-light">Subtotal</span>
                                    <span className="text-xl text-black font-light">{formatPrice(totalPrice)}</span>
                                </div>
                                <Link
                                    href="/checkout"
                                    onClick={closeCart}
                                    className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-[#6CD8D1] text-white rounded-xl font-medium hover:bg-[#5BC0B9] transition-all shadow-lg shadow-[#6CD8D1]/20"
                                >
                                    Proceed to Checkout
                                    <ArrowRight className="w-4 h-4" />
                                </Link>
                                <p className="text-black/30 text-xs text-center mt-4">
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
            className="relative p-2 hover:bg-black/5 rounded-full transition-colors"
            aria-label="Open cart"
        >
            <ShoppingBag className="w-5 h-5 text-black/60" />
            {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#6CD8D1] text-white text-xs font-medium rounded-full flex items-center justify-center shadow-sm">
                    {totalItems > 9 ? '9+' : totalItems}
                </span>
            )}
        </button>
    );
}
