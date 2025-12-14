'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
    ArrowLeft,
    ShoppingBag,
    Loader2,
    CheckCircle,
    Trash2,
    MapPin
} from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import { PageHeader } from '@/components/page-header';

export default function CheckoutPage() {
    const router = useRouter();
    const { items, totalPrice, removeItem, clearCart } = useCart();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [orderId, setOrderId] = useState('');
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        street: '',
        city: '',
        postalCode: '',
        notes: '',
    });

    // Calculate shipping (free for now, can be updated)
    const shipping = 0;
    const total = totalPrice + shipping;

    // Format price in LKR
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-LK', {
            style: 'currency',
            currency: 'LKR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(price);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (items.length === 0) {
            setError('Your cart is empty');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    customer: {
                        name: formData.name,
                        email: formData.email,
                        phone: formData.phone,
                        address: {
                            street: formData.street,
                            city: formData.city,
                            postalCode: formData.postalCode,
                            country: 'Sri Lanka',
                        },
                    },
                    items: items.map((item) => ({
                        productId: item.id,
                        title: item.title,
                        price: item.price,
                        quantity: item.quantity,
                        image: item.image,
                    })),
                    subtotal: totalPrice,
                    shipping,
                    notes: formData.notes,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to place order');
            }

            setOrderId(data.orderId);
            setSuccess(true);
            clearCart();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to place order');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen bg-[#0a0a0a]">
                <PageHeader title="Order Confirmed" />

                <section className="pt-32 pb-24 px-6 lg:px-12">
                    <div className="max-w-xl mx-auto text-center">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', damping: 15 }}
                            className="w-24 h-24 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-8"
                        >
                            <CheckCircle className="w-12 h-12 text-emerald-400" />
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <h1 className="text-4xl font-light text-white mb-4">Thank You!</h1>
                            <p className="text-white/60 text-lg mb-2">Your order has been placed successfully.</p>
                            <p className="text-white/40 mb-8">
                                Order ID: <span className="text-white font-mono">{orderId}</span>
                            </p>

                            <div className="bg-white/[0.02] border border-white/[0.08] rounded-2xl p-6 mb-8 text-left">
                                <h3 className="text-white/60 text-sm mb-4">What happens next?</h3>
                                <ul className="space-y-3 text-white/50 text-sm">
                                    <li className="flex gap-3">
                                        <span className="text-emerald-400">1.</span>
                                        We'll send a confirmation email to {formData.email}
                                    </li>
                                    <li className="flex gap-3">
                                        <span className="text-emerald-400">2.</span>
                                        We'll contact you with payment details
                                    </li>
                                    <li className="flex gap-3">
                                        <span className="text-emerald-400">3.</span>
                                        Once confirmed, we'll carefully prepare your artwork for shipping
                                    </li>
                                </ul>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link
                                    href="/shop"
                                    className="px-8 py-4 bg-white text-black rounded-xl font-medium hover:bg-white/90 transition-all"
                                >
                                    Continue Shopping
                                </Link>
                                <Link
                                    href="/"
                                    className="px-8 py-4 border border-white/20 text-white rounded-xl font-light hover:bg-white/5 transition-all"
                                >
                                    Return Home
                                </Link>
                            </div>
                        </motion.div>
                    </div>
                </section>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0a0a0a]">
            <PageHeader title="Checkout" backHref="/shop" backLabel="Continue Shopping" />

            <section className="pt-32 pb-24 px-6 lg:px-12">
                <div className="max-w-6xl mx-auto">
                    {items.length === 0 ? (
                        <div className="text-center py-20">
                            <ShoppingBag className="w-20 h-20 text-white/10 mx-auto mb-6" />
                            <h2 className="text-2xl font-light text-white mb-4">Your cart is empty</h2>
                            <p className="text-white/40 mb-8">Add some beautiful artwork to get started.</p>
                            <Link
                                href="/shop"
                                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-black rounded-xl font-medium hover:bg-white/90 transition-all"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Browse Collection
                            </Link>
                        </div>
                    ) : (
                        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
                            {/* Order Summary */}
                            <div className="order-2 lg:order-1">
                                <h2 className="text-xl font-light text-white mb-6 flex items-center gap-3">
                                    <ShoppingBag className="w-5 h-5 text-white/60" />
                                    Order Summary
                                </h2>

                                <div className="space-y-4 mb-8">
                                    {items.map((item) => (
                                        <div
                                            key={item.id}
                                            className="flex gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/[0.05]"
                                        >
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
                                                        <span className="text-xl font-serif italic text-white/20">CM</span>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-white font-light truncate">{item.title}</h3>
                                                <p className="text-white/40 text-sm">Qty: {item.quantity}</p>
                                                <p className="text-white/60 mt-1">{formatPrice(item.price * item.quantity)}</p>
                                            </div>
                                            <button
                                                onClick={() => removeItem(item.id)}
                                                className="p-2 hover:bg-red-500/10 rounded-lg transition-colors self-start"
                                            >
                                                <Trash2 className="w-4 h-4 text-white/40 hover:text-red-400" />
                                            </button>
                                        </div>
                                    ))}
                                </div>

                                {/* Totals */}
                                <div className="border-t border-white/[0.08] pt-6 space-y-3">
                                    <div className="flex justify-between text-white/60">
                                        <span>Subtotal</span>
                                        <span>{formatPrice(totalPrice)}</span>
                                    </div>
                                    <div className="flex justify-between text-white/60">
                                        <span>Shipping</span>
                                        <span>{shipping === 0 ? 'Calculated after order' : formatPrice(shipping)}</span>
                                    </div>
                                    <div className="flex justify-between text-lg text-white pt-3 border-t border-white/[0.08]">
                                        <span>Total</span>
                                        <span>{formatPrice(total)}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Checkout Form */}
                            <div className="order-1 lg:order-2">
                                <h2 className="text-xl font-light text-white mb-6 flex items-center gap-3">
                                    <MapPin className="w-5 h-5 text-white/60" />
                                    Delivery Details
                                </h2>

                                {error && (
                                    <div className="mb-6 p-4 rounded-xl border border-red-500/20 bg-red-500/5">
                                        <p className="text-sm text-red-300">{error}</p>
                                    </div>
                                )}

                                <form onSubmit={handleSubmit} className="space-y-5">
                                    <div className="grid sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm text-white/60 mb-2">Full Name *</label>
                                            <input
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                required
                                                disabled={loading}
                                                className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white placeholder-white/30 focus:outline-none focus:border-white/20 transition-all disabled:opacity-50"
                                                placeholder="John Doe"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm text-white/60 mb-2">Phone *</label>
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                required
                                                disabled={loading}
                                                className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white placeholder-white/30 focus:outline-none focus:border-white/20 transition-all disabled:opacity-50"
                                                placeholder="+94 77 123 4567"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm text-white/60 mb-2">Email *</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                            disabled={loading}
                                            className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white placeholder-white/30 focus:outline-none focus:border-white/20 transition-all disabled:opacity-50"
                                            placeholder="your@email.com"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm text-white/60 mb-2">Street Address *</label>
                                        <input
                                            type="text"
                                            name="street"
                                            value={formData.street}
                                            onChange={handleChange}
                                            required
                                            disabled={loading}
                                            className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white placeholder-white/30 focus:outline-none focus:border-white/20 transition-all disabled:opacity-50"
                                            placeholder="123 Main Street, Apartment 4B"
                                        />
                                    </div>

                                    <div className="grid sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm text-white/60 mb-2">City *</label>
                                            <input
                                                type="text"
                                                name="city"
                                                value={formData.city}
                                                onChange={handleChange}
                                                required
                                                disabled={loading}
                                                className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white placeholder-white/30 focus:outline-none focus:border-white/20 transition-all disabled:opacity-50"
                                                placeholder="Colombo"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm text-white/60 mb-2">Postal Code *</label>
                                            <input
                                                type="text"
                                                name="postalCode"
                                                value={formData.postalCode}
                                                onChange={handleChange}
                                                required
                                                disabled={loading}
                                                className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white placeholder-white/30 focus:outline-none focus:border-white/20 transition-all disabled:opacity-50"
                                                placeholder="00100"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm text-white/60 mb-2">Order Notes (optional)</label>
                                        <textarea
                                            name="notes"
                                            value={formData.notes}
                                            onChange={handleChange}
                                            disabled={loading}
                                            rows={3}
                                            className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white placeholder-white/30 focus:outline-none focus:border-white/20 transition-all disabled:opacity-50 resize-none"
                                            placeholder="Any special instructions for delivery..."
                                        />
                                    </div>

                                    <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4">
                                        <p className="text-amber-300 text-sm">
                                            <strong>Payment:</strong> After placing your order, we will contact you with payment details.
                                            We accept bank transfers and cash on delivery for Colombo.
                                        </p>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading || items.length === 0}
                                        className="w-full px-6 py-4 bg-white text-black rounded-xl font-medium hover:bg-white/90 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                                    >
                                        {loading ? (
                                            <>
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                                Placing Order...
                                            </>
                                        ) : (
                                            <>
                                                Place Order
                                                <span className="text-black/60">({formatPrice(total)})</span>
                                            </>
                                        )}
                                    </button>
                                </form>
                            </div>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
