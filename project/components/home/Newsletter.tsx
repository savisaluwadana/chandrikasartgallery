'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Loader2 } from 'lucide-react';

export function Newsletter() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setError('');
        setLoading(true);

        try {
            const res = await fetch('/api/subscribers/subscribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Failed to subscribe');
            }

            setSuccess(true);
            setEmail('');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error subscribing');
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="py-40 px-6 lg:px-12 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/[0.02]" />
            <div className="max-w-4xl mx-auto text-center relative z-10">
                <span className="text-xs tracking-[0.3em] uppercase text-black/40 mb-8 block">Join the Circle</span>
                <h2 className="text-6xl md:text-8xl font-light mb-12 tracking-tight">
                    Stay <span className="font-serif italic text-[#6CD8D1]">Inspired</span>
                </h2>
                <p className="text-black/40 text-xl max-w-xl mx-auto mb-16 font-light leading-relaxed">
                    Receive exclusive previews of new collections, behind-the-scenes content,
                    and invitations to private viewings.
                </p>

                {success ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col items-center gap-4"
                    >
                        <div className="w-16 h-16 rounded-full bg-[#6CD8D1]/10 border border-[#6CD8D1]/20 flex items-center justify-center">
                            <CheckCircle className="w-8 h-8 text-[#6CD8D1]" />
                        </div>
                        <p className="text-black/60 text-lg">Welcome to the circle! Check your inbox.</p>
                    </motion.div>
                ) : (
                    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email address"
                            required
                            disabled={loading}
                            className="w-full sm:w-96 px-8 py-5 bg-black/5 border border-black/10 rounded-full text-black placeholder:text-black/20 focus:outline-none focus:border-black/30 transition-colors disabled:opacity-50"
                        />
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full sm:w-auto px-10 py-5 bg-black text-white rounded-full font-medium hover:bg-black/90 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {loading && <Loader2 className="w-5 h-5 animate-spin" />}
                            {loading ? 'Subscribing...' : 'Subscribe'}
                        </button>
                    </form>
                )}

                {error && (
                    <p className="text-red-400 mt-4 text-sm">{error}</p>
                )}
            </div>
        </section>
    );
}
