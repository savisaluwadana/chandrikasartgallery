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
        <section className="py-40 px-6 lg:px-12 relative overflow-hidden bg-gradient-to-br from-[#6CD8D1] via-blue-500 to-purple-600">
            <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-overlay" />
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black/20 to-transparent" />

            {/* Ambient Orbs */}
            <div className="absolute top-[-50%] left-[-20%] w-[1000px] h-[1000px] bg-white/10 rounded-full blur-[150px] mix-blend-overlay" />
            <div className="absolute bottom-[-50%] right-[-20%] w-[1000px] h-[1000px] bg-purple-900/40 rounded-full blur-[150px] mix-blend-multiply" />
            <div className="max-w-4xl mx-auto text-center relative z-10">
                <span className="text-xs tracking-[0.3em] uppercase text-white/60 mb-8 block">Join the Circle</span>
                <h2 className="text-6xl md:text-8xl font-light mb-12 tracking-tight text-white">
                    Stay <span className="font-serif italic text-white mix-blend-overlay">Inspired</span>
                </h2>
                <p className="text-white/80 text-xl max-w-xl mx-auto mb-16 font-light leading-relaxed">
                    Receive exclusive previews of new collections, behind-the-scenes content,
                    and invitations to private viewings.
                </p>

                {success ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col items-center gap-4"
                    >
                        <div className="w-16 h-16 rounded-full bg-white/20 border border-white/40 flex items-center justify-center">
                            <CheckCircle className="w-8 h-8 text-white" />
                        </div>
                        <p className="text-white text-lg">Welcome to the circle! Check your inbox.</p>
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
                            className="w-full sm:w-96 px-8 py-5 bg-white/10 border border-white/20 rounded-full text-white placeholder:text-white/60 focus:outline-none focus:bg-white/20 focus:border-white/40 transition-all disabled:opacity-50"
                        />
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full sm:w-auto px-10 py-5 bg-white text-[#6CD8D1] rounded-full font-medium hover:bg-white/90 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {loading && <Loader2 className="w-5 h-5 animate-spin" />}
                            {loading ? 'Subscribing...' : 'Subscribe'}
                        </button>
                    </form>
                )}

                {error && (
                    <p className="text-white/80 mt-4 text-sm bg-red-500/20 py-1 px-3 rounded-full inline-block">{error}</p>
                )}
            </div>
        </section>
    );
}
