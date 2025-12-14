'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { PageHeader } from '@/components/page-header';

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: 'general',
        message: '',
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Failed to send message');
            }

            setSuccess(true);
            setFormData({ name: '', email: '', subject: 'general', message: '' });
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error sending message');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a]">
            <PageHeader title="Contact" />

            <section className="pt-32 pb-24 px-6 lg:px-12">
                <div className="max-w-6xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-16 lg:gap-24">
                        {/* Contact Info */}
                        <div>
                            <motion.span
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-xs tracking-[0.3em] uppercase text-white/40 mb-6 block"
                            >
                                Get in Touch
                            </motion.span>
                            <motion.h1
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="text-4xl md:text-5xl font-light leading-tight mb-8"
                            >
                                Let's Create <span className="font-serif italic text-white/80">Together</span>
                            </motion.h1>
                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="text-white/50 text-lg leading-relaxed mb-12 font-light"
                            >
                                Whether you're interested in a custom commission, have questions about
                                available works, or simply want to say hello—I'd love to hear from you.
                            </motion.p>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="space-y-6"
                            >
                                <div className="flex items-center gap-4 text-white/50">
                                    <div className="w-12 h-12 rounded-full bg-white/[0.03] border border-white/[0.08] flex items-center justify-center">
                                        <Mail className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <span className="text-xs tracking-[0.2em] uppercase text-white/30 block">Email</span>
                                        <span className="text-white/70">hello@chandrikamaelgeart.com</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 text-white/50">
                                    <div className="w-12 h-12 rounded-full bg-white/[0.03] border border-white/[0.08] flex items-center justify-center">
                                        <Phone className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <span className="text-xs tracking-[0.2em] uppercase text-white/30 block">Phone</span>
                                        <span className="text-white/70">+94 77 123 4567</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 text-white/50">
                                    <div className="w-12 h-12 rounded-full bg-white/[0.03] border border-white/[0.08] flex items-center justify-center">
                                        <MapPin className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <span className="text-xs tracking-[0.2em] uppercase text-white/30 block">Studio</span>
                                        <span className="text-white/70">Colombo, Sri Lanka</span>
                                    </div>
                                </div>
                            </motion.div>
                        </div>

                        {/* Contact Form */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-8 md:p-10"
                        >
                            {success ? (
                                <div className="text-center py-12">
                                    <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-6">
                                        <CheckCircle className="w-8 h-8 text-emerald-400" />
                                    </div>
                                    <h2 className="text-2xl font-light text-white mb-3">Message Sent!</h2>
                                    <p className="text-white/40 mb-8 font-light">
                                        Thank you for reaching out. I'll get back to you soon.
                                    </p>
                                    <button
                                        onClick={() => setSuccess(false)}
                                        className="text-white/60 hover:text-white transition-colors"
                                    >
                                        Send another message
                                    </button>
                                </div>
                            ) : (
                                <>
                                    {error && (
                                        <div className="mb-6 p-4 rounded-xl border border-red-500/20 bg-red-500/5">
                                            <div className="flex gap-3 items-start">
                                                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                                                <p className="text-sm text-red-300">{error}</p>
                                            </div>
                                        </div>
                                    )}

                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <div>
                                            <label htmlFor="name" className="block text-sm font-medium text-white/60 mb-2">
                                                Name
                                            </label>
                                            <input
                                                id="name"
                                                name="name"
                                                type="text"
                                                value={formData.name}
                                                onChange={handleChange}
                                                required
                                                disabled={loading}
                                                className="w-full px-5 py-4 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white placeholder-white/30 focus:outline-none focus:border-white/20 focus:bg-white/[0.05] transition-all disabled:opacity-50"
                                                placeholder="Your name"
                                            />
                                        </div>

                                        <div>
                                            <label htmlFor="email" className="block text-sm font-medium text-white/60 mb-2">
                                                Email
                                            </label>
                                            <input
                                                id="email"
                                                name="email"
                                                type="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                required
                                                disabled={loading}
                                                className="w-full px-5 py-4 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white placeholder-white/30 focus:outline-none focus:border-white/20 focus:bg-white/[0.05] transition-all disabled:opacity-50"
                                                placeholder="your@email.com"
                                            />
                                        </div>

                                        <div>
                                            <label htmlFor="subject" className="block text-sm font-medium text-white/60 mb-2">
                                                Subject
                                            </label>
                                            <select
                                                id="subject"
                                                name="subject"
                                                value={formData.subject}
                                                onChange={handleChange}
                                                disabled={loading}
                                                className="w-full px-5 py-4 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white focus:outline-none focus:border-white/20 focus:bg-white/[0.05] transition-all disabled:opacity-50"
                                            >
                                                <option value="general" className="bg-[#0a0a0a]">General Inquiry</option>
                                                <option value="commission" className="bg-[#0a0a0a]">Commission Request</option>
                                                <option value="purchase" className="bg-[#0a0a0a]">Purchase Inquiry</option>
                                                <option value="collaboration" className="bg-[#0a0a0a]">Collaboration</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label htmlFor="message" className="block text-sm font-medium text-white/60 mb-2">
                                                Message
                                            </label>
                                            <textarea
                                                id="message"
                                                name="message"
                                                value={formData.message}
                                                onChange={handleChange}
                                                required
                                                disabled={loading}
                                                rows={5}
                                                className="w-full px-5 py-4 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white placeholder-white/30 focus:outline-none focus:border-white/20 focus:bg-white/[0.05] transition-all disabled:opacity-50 resize-none"
                                                placeholder="Tell me about your project or inquiry..."
                                            />
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="w-full px-6 py-4 bg-white text-black rounded-xl font-medium hover:bg-white/90 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                                        >
                                            {loading ? (
                                                <>
                                                    <Loader2 className="h-5 w-5 animate-spin" />
                                                    Sending...
                                                </>
                                            ) : (
                                                <>
                                                    <Send className="w-5 h-5" />
                                                    Send Message
                                                </>
                                            )}
                                        </button>
                                    </form>
                                </>
                            )}
                        </motion.div>
                    </div>
                </div>
            </section>
        </div>
    );
}
