'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Loader2, RefreshCw, Package, ChevronDown, Search, ExternalLink } from 'lucide-react';

interface OrderItem {
    productId: string;
    title: string;
    price: number;
    quantity: number;
    image?: string;
}

interface Order {
    _id: string;
    orderId: string;
    customer: {
        name: string;
        email: string;
        phone: string;
        address: {
            street: string;
            city: string;
            postalCode: string;
            country: string;
        };
    };
    items: OrderItem[];
    subtotal: number;
    shipping: number;
    total: number;
    status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
    notes?: string;
    createdAt: string;
}

const STATUS_COLORS: Record<string, string> = {
    pending: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
    confirmed: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
    processing: 'bg-purple-500/10 text-purple-600 border-purple-500/20',
    shipped: 'bg-cyan-500/10 text-cyan-600 border-cyan-500/20',
    delivered: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
    cancelled: 'bg-red-500/10 text-red-600 border-red-500/20',
};

const PAYMENT_COLORS: Record<string, string> = {
    pending: 'text-amber-600',
    paid: 'text-emerald-600',
    failed: 'text-red-600',
    refunded: 'text-purple-600',
};

const STATUS_OPTIONS = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
    const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/orders', { cache: 'no-store' });
            if (res.ok) {
                const data = await res.json();
                setOrders(Array.isArray(data) ? data : []);
            }
        } catch (err) {
            console.error('Error fetching orders:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleStatusChange = async (orderId: string, newStatus: string) => {
        setUpdatingStatus(orderId);
        try {
            const res = await fetch(`/api/orders/${orderId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus }),
            });
            if (res.ok) {
                setOrders(prev =>
                    prev.map(o => o.orderId === orderId ? { ...o, status: newStatus as Order['status'] } : o)
                );
            }
        } catch (err) {
            console.error('Failed to update status:', err);
        } finally {
            setUpdatingStatus(null);
        }
    };

    const formatPrice = (price: number) => `Rs. ${price.toLocaleString()}`;
    const formatDate = (d: string) => new Date(d).toLocaleDateString('en-LK', {
        day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
    });

    const filtered = orders.filter(o =>
        o.orderId.toLowerCase().includes(search.toLowerCase()) ||
        o.customer.name.toLowerCase().includes(search.toLowerCase()) ||
        o.customer.email.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="max-w-7xl mx-auto space-y-6 bg-white min-h-screen p-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-semibold text-black">Orders</h1>
                    <p className="text-black/40 text-sm mt-1">{orders.length} total order{orders.length !== 1 ? 's' : ''}</p>
                </div>
                <button
                    onClick={fetchOrders}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-black/[0.08] text-black/60 text-sm hover:bg-black/[0.03] transition-colors"
                >
                    <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
                    Refresh
                </button>
            </div>

            {/* Search */}
            <div className="relative">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-black/30" />
                <input
                    type="text"
                    placeholder="Search by order ID, customer name or email..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-black/[0.08] bg-black/[0.02] text-sm text-black placeholder-black/30 focus:outline-none focus:border-black/20 transition-all"
                />
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                    { label: 'Pending', count: orders.filter(o => o.status === 'pending').length, color: 'text-amber-600' },
                    { label: 'Confirmed', count: orders.filter(o => o.status === 'confirmed').length, color: 'text-blue-600' },
                    { label: 'Shipped', count: orders.filter(o => o.status === 'shipped').length, color: 'text-cyan-600' },
                    { label: 'Delivered', count: orders.filter(o => o.status === 'delivered').length, color: 'text-emerald-600' },
                ].map(stat => (
                    <div key={stat.label} className="bg-white border border-black/[0.08] rounded-xl p-4">
                        <div className={`text-2xl font-semibold ${stat.color}`}>{stat.count}</div>
                        <div className="text-xs text-black/40 mt-0.5">{stat.label}</div>
                    </div>
                ))}
            </div>

            {/* Orders List */}
            {loading ? (
                <div className="flex items-center justify-center py-24">
                    <Loader2 className="h-8 w-8 animate-spin text-black/20" />
                </div>
            ) : filtered.length === 0 ? (
                <div className="text-center py-24 bg-white border border-black/[0.08] rounded-xl">
                    <Package size={40} className="mx-auto text-black/10 mb-4" />
                    <h3 className="text-lg font-light text-black mb-2">No orders found</h3>
                    <p className="text-sm text-black/40">
                        {search ? 'Try adjusting your search.' : 'Orders will appear here when customers place them.'}
                    </p>
                </div>
            ) : (
                <div className="space-y-3">
                    {filtered.map(order => (
                        <div key={order._id} className="bg-white border border-black/[0.08] rounded-xl overflow-hidden hover:border-black/[0.14] transition-colors">
                            {/* Order Header Row */}
                            <div className="px-5 py-4 flex flex-wrap gap-4 items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div>
                                        <p className="font-mono text-sm font-medium text-black">{order.orderId}</p>
                                        <p className="text-xs text-black/40 mt-0.5">{formatDate(order.createdAt)}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 flex-wrap">
                                    {/* Status dropdown */}
                                    <div className="relative">
                                        <select
                                            value={order.status}
                                            onChange={e => handleStatusChange(order.orderId, e.target.value)}
                                            disabled={updatingStatus === order.orderId}
                                            className={`appearance-none pr-7 pl-3 py-1.5 rounded-full border text-xs font-medium cursor-pointer focus:outline-none transition-all ${STATUS_COLORS[order.status]} disabled:opacity-60`}
                                        >
                                            {STATUS_OPTIONS.map(s => (
                                                <option key={s} value={s} className="bg-white text-black capitalize">
                                                    {s.charAt(0).toUpperCase() + s.slice(1)}
                                                </option>
                                            ))}
                                        </select>
                                        <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                                    </div>

                                    <span className={`text-xs font-medium capitalize ${PAYMENT_COLORS[order.paymentStatus]}`}>
                                        {order.paymentStatus}
                                    </span>

                                    <span className="text-sm font-medium text-black">{formatPrice(order.total)}</span>

                                    <button
                                        onClick={() => setExpandedOrder(expandedOrder === order._id ? null : order._id)}
                                        className="p-1.5 rounded-lg hover:bg-black/5 transition-colors"
                                    >
                                        <ChevronDown
                                            size={16}
                                            className={`text-black/40 transition-transform ${expandedOrder === order._id ? 'rotate-180' : ''}`}
                                        />
                                    </button>
                                </div>
                            </div>

                            {/* Expanded Details */}
                            {expandedOrder === order._id && (
                                <div className="border-t border-black/[0.06] px-5 py-5 grid sm:grid-cols-2 gap-6">
                                    {/* Customer Info */}
                                    <div>
                                        <h4 className="text-xs tracking-[0.15em] uppercase text-black/40 mb-3">Customer</h4>
                                        <p className="text-sm font-medium text-black">{order.customer.name}</p>
                                        <p className="text-sm text-black/50">{order.customer.email}</p>
                                        <p className="text-sm text-black/50">{order.customer.phone}</p>
                                        <p className="text-sm text-black/40 mt-2">
                                            {order.customer.address.street},<br />
                                            {order.customer.address.city}, {order.customer.address.postalCode}<br />
                                            {order.customer.address.country}
                                        </p>
                                        {order.notes && (
                                            <div className="mt-3 p-3 bg-black/[0.02] rounded-lg">
                                                <p className="text-xs text-black/40 mb-1">Notes</p>
                                                <p className="text-sm text-black/60">{order.notes}</p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Items */}
                                    <div>
                                        <h4 className="text-xs tracking-[0.15em] uppercase text-black/40 mb-3">Items ({order.items.length})</h4>
                                        <div className="space-y-3">
                                            {order.items.map((item, idx) => (
                                                <div key={idx} className="flex items-center gap-3">
                                                    {item.image ? (
                                                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-black/5 flex-shrink-0 relative">
                                                            <Image src={item.image} alt={item.title} fill className="object-cover" />
                                                        </div>
                                                    ) : (
                                                        <div className="w-12 h-12 rounded-lg bg-black/[0.04] flex items-center justify-center flex-shrink-0">
                                                            <span className="text-xs font-serif italic text-black/20">CM</span>
                                                        </div>
                                                    )}
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm text-black truncate">{item.title}</p>
                                                        <p className="text-xs text-black/40">Qty: {item.quantity} × {formatPrice(item.price)}</p>
                                                    </div>
                                                    <p className="text-sm font-medium text-black flex-shrink-0">{formatPrice(item.price * item.quantity)}</p>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Totals */}
                                        <div className="mt-4 pt-4 border-t border-black/[0.06] space-y-1">
                                            <div className="flex justify-between text-sm text-black/50">
                                                <span>Subtotal</span><span>{formatPrice(order.subtotal)}</span>
                                            </div>
                                            <div className="flex justify-between text-sm text-black/50">
                                                <span>Shipping</span>
                                                <span>{order.shipping === 0 ? 'TBD' : formatPrice(order.shipping)}</span>
                                            </div>
                                            <div className="flex justify-between text-sm font-semibold text-black pt-1 border-t border-black/[0.06]">
                                                <span>Total</span><span>{formatPrice(order.total)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
