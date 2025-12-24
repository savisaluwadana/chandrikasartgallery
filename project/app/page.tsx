'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight, Menu, X, ChevronDown, Loader2, CheckCircle } from 'lucide-react';
import { AuthNav, AuthNavMobile } from '@/components/auth-nav';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '/gallery', label: 'Gallery' },
    { href: '/shop', label: 'Collection' },
    { href: '/blog', label: 'Journal' },
    { href: '/subscribe', label: 'Subscribe' },
  ];

  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.8,
        ease: [0.215, 0.61, 0.355, 1] as const,
      },
    }),
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-white/20">
      {/* Navigation */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 w-full z-50 transition-all duration-500 ${scrolled ? 'bg-[#050505]/80 backdrop-blur-md border-b border-white/[0.05]' : 'bg-transparent'}`}
      >
        <div className="max-w-[1800px] mx-auto px-6 lg:px-12">
          <div className="flex items-center justify-between h-24">
            {/* Logo */}
            <Link href="/" className="relative z-50 group">
              <div className="flex flex-col">
                <span className="text-xl tracking-[0.2em] font-light uppercase group-hover:opacity-70 transition-opacity">
                  Chandrika <span className="font-medium">Maelge</span>
                </span>
                <span className="text-[10px] tracking-[0.4em] text-white/40 uppercase mt-1">Fine Art</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-16">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-white/60 hover:text-white transition-colors tracking-[0.1em] uppercase relative group overflow-hidden"
                >
                  <span className="relative z-10">{link.label}</span>
                  <span className="absolute bottom-0 left-0 w-full h-[1px] bg-white transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out" />
                </Link>
              ))}
              <AuthNav />
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden relative z-50 p-2 hover:bg-white/5 rounded-full transition-colors"
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="md:hidden fixed inset-0 bg-[#050505] z-40 flex flex-col"
            >
              {/* Mobile Menu Header with Logo */}
              <div className="flex items-center justify-between h-24 px-6">
                <Link href="/" onClick={() => setMenuOpen(false)} className="group">
                  <div className="flex flex-col">
                    <span className="text-xl tracking-[0.2em] font-light uppercase group-hover:opacity-70 transition-opacity">
                      Chandrika <span className="font-medium">Maelge</span>
                    </span>
                    <span className="text-[10px] tracking-[0.4em] text-white/40 uppercase mt-1">Fine Art</span>
                  </div>
                </Link>
                <button
                  onClick={() => setMenuOpen(false)}
                  className="p-2 hover:bg-white/5 rounded-full transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Mobile Menu Links */}
              <div className="flex-1 flex flex-col justify-center items-center gap-8">
                {navLinks.map((link, index) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.3 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setMenuOpen(false)}
                      className="text-4xl font-light tracking-wide hover:text-white/60 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
                <motion.div
                  className="mt-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.3 }}
                >
                  <AuthNavMobile onClose={() => setMenuOpen(false)} />
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        {/* Background Elements */}
        <motion.div style={{ y, opacity }} className="absolute inset-0 z-0">
          <div className="absolute top-1/4 left-1/4 w-[800px] h-[800px] bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded-full blur-[120px] opacity-40" />
          <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-gradient-to-r from-violet-500/10 to-purple-500/10 rounded-full blur-[120px] opacity-40" />
          <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay" />
        </motion.div>

        <div className="relative z-10 max-w-[1800px] mx-auto px-6 lg:px-12 w-full">
          <div className="max-w-6xl">
            {/* Tagline */}
            <motion.div
              custom={0}
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
              className="inline-flex items-center gap-4 mb-12"
            >
              <div className="w-16 h-[1px] bg-white/30" />
              <span className="text-sm tracking-[0.4em] uppercase text-white/60">Contemporary Fine Art</span>
            </motion.div>

            {/* Main Heading */}
            <motion.h1
              custom={1}
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
              className="text-6xl sm:text-7xl md:text-8xl lg:text-[10rem] font-light leading-[0.9] tracking-tight mb-12 mix-blend-difference"
            >
              Where Art <br />
              <span className="font-serif italic text-white/90">Transcends</span> <br />
              The Ordinary
            </motion.h1>

            {/* Description */}
            <motion.p
              custom={2}
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
              className="text-xl md:text-2xl text-white/50 max-w-2xl leading-relaxed mb-16 font-light"
            >
              A curated collection of masterpieces that evoke emotion and transform spaces into sanctuaries of profound beauty.
            </motion.p>

            {/* CTAs */}
            <motion.div
              custom={3}
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
              className="flex flex-col sm:flex-row gap-6"
            >
              <Link href="/shop">
                <span className="group inline-flex items-center gap-4 px-10 py-5 bg-white text-black rounded-full text-lg font-medium hover:bg-white/90 transition-all transform hover:scale-105 duration-300">
                  View Collection
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
              <Link href="/gallery">
                <span className="group inline-flex items-center gap-4 px-10 py-5 border border-white/20 rounded-full text-lg font-light hover:bg-white/5 transition-all">
                  Explore Gallery
                  <ArrowUpRight size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </span>
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 text-white/30"
        >
          <span className="text-[10px] tracking-[0.3em] uppercase">Scroll</span>
          <ChevronDown className="animate-bounce" size={20} />
        </motion.div>
      </section>

      {/* Featured Section */}
      <section className="py-40 px-6 lg:px-12 border-t border-white/[0.05]">
        <div className="max-w-[1800px] mx-auto">
          <div className="grid lg:grid-cols-12 gap-16 lg:gap-24 items-center">
            {/* Text Content */}
            <div className="lg:col-span-5">
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-xs tracking-[0.3em] uppercase text-white/40 mb-6 block"
              >
                The Artist
              </motion.span>
              <motion.h2
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-5xl md:text-6xl font-light leading-tight mb-10"
              >
                A Journey Through <br />
                <span className="font-serif italic text-white/80">Color & Emotion</span>
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="text-white/50 text-xl leading-relaxed mb-12 font-light"
              >
                Chandrika Maelge creates art that bridges the gap between the visible
                and the felt. With each brushstroke, she captures moments of profound
                beauty and invites viewers into a world where imagination reigns supreme.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
              >
                <Link href="/blog">
                  <span className="group inline-flex items-center gap-2 text-lg text-white hover:text-white/70 transition-colors border-b border-white/30 pb-1">
                    Read the Journal
                    <ArrowUpRight size={18} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </span>
                </Link>
              </motion.div>
            </div>

            {/* Image Placeholder */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="lg:col-span-7 relative aspect-[4/3] bg-[#111] rounded-sm overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.05] to-transparent opacity-50" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center transform group-hover:scale-105 transition-transform duration-700">
                  <div className="w-32 h-32 rounded-full border border-white/10 flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
                    <span className="text-5xl font-serif italic text-white/20">CM</span>
                  </div>
                  <span className="text-white/30 text-sm tracking-[0.2em] uppercase">Featured Artwork</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services/Features */}
      <section className="py-40 px-6 lg:px-12 bg-[#080808]">
        <div className="max-w-[1800px] mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-24">
            <div>
              <span className="text-xs tracking-[0.3em] uppercase text-white/40 mb-6 block">What We Offer</span>
              <h2 className="text-5xl md:text-7xl font-light">
                Experience the <br />
                <span className="font-serif italic text-white/80">Extraordinary</span>
              </h2>
            </div>
            <Link href="/shop" className="hidden md:block">
              <span className="group inline-flex items-center gap-3 px-8 py-4 border border-white/10 rounded-full text-sm font-medium hover:bg-white text-white hover:text-black transition-all">
                View All Services
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-px bg-white/10 border border-white/10">
            {[
              {
                title: 'Original Art',
                description: 'One-of-a-kind pieces crafted with passion and precision',
                link: '/shop',
              },
              {
                title: 'Limited Prints',
                description: 'Exclusive numbered editions for discerning collectors',
                link: '/shop',
              },
              {
                title: 'Commissions',
                description: 'Bespoke artwork tailored to your vision and space',
                link: '/subscribe',
              },
              {
                title: 'Art Journal',
                description: 'Insights into the creative process and artistic journey',
                link: '/blog',
              },
            ].map((item, idx) => (
              <Link key={idx} href={item.link} className="group relative bg-[#050505] p-12 h-96 flex flex-col justify-between hover:bg-[#0a0a0a] transition-colors">
                <div>
                  <span className="text-6xl font-serif italic text-white/10 block mb-8 group-hover:text-white/20 transition-colors">0{idx + 1}</span>
                  <h3 className="text-2xl font-light mb-4 group-hover:text-white transition-colors">{item.title}</h3>
                  <p className="text-white/40 text-sm leading-relaxed font-light max-w-[200px]">{item.description}</p>
                </div>
                <div className="flex justify-end">
                  <ArrowUpRight size={24} className="text-white/20 group-hover:text-white group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <NewsletterSection />

      {/* Footer */}
      <footer className="border-t border-white/[0.05] py-24 px-6 lg:px-12 bg-[#020202]">
        <div className="max-w-[1800px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-16 mb-24">
            {/* Brand */}
            <div className="lg:col-span-4">
              <Link href="/" className="block mb-8">
                <span className="text-2xl tracking-[0.2em] font-light uppercase">
                  Chandrika <span className="font-medium">Maelge</span>
                </span>
              </Link>
              <p className="text-white/30 text-lg max-w-sm leading-relaxed font-light">
                Creating art that speaks to the soul. Based in Sri Lanka,
                exhibited worldwide.
              </p>
            </div>

            {/* Links */}
            <div className="lg:col-span-2 lg:col-start-7">
              <h4 className="text-xs tracking-[0.2em] uppercase text-white/40 mb-8">Explore</h4>
              <ul className="space-y-4">
                {[
                  { label: 'Gallery', href: '/gallery' },
                  { label: 'Collection', href: '/shop' },
                  { label: 'Journal', href: '/blog' },
                  { label: 'About', href: '/about' },
                ].map((item) => (
                  <li key={item.label}>
                    <Link href={item.href} className="text-white/50 hover:text-white transition-colors font-light">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Connect */}
            <div className="lg:col-span-2">
              <h4 className="text-xs tracking-[0.2em] uppercase text-white/40 mb-8">Connect</h4>
              <ul className="space-y-4">
                {[
                  { label: 'Subscribe', href: '/subscribe' },
                  { label: 'Contact', href: '/contact' },
                  { label: 'Instagram', href: 'https://instagram.com' },
                  { label: 'Studio', href: '/admin' },
                ].map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="text-white/50 hover:text-white transition-colors font-light"
                      {...(item.href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal */}
            <div className="lg:col-span-2">
              <h4 className="text-xs tracking-[0.2em] uppercase text-white/40 mb-8">Legal</h4>
              <ul className="space-y-4">
                {[
                  { label: 'Privacy Policy', href: '/privacy' },
                  { label: 'Terms of Service', href: '/terms' },
                ].map((item) => (
                  <li key={item.label}>
                    <Link href={item.href} className="text-white/50 hover:text-white transition-colors font-light">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom */}
          <div className="pt-8 border-t border-white/[0.05] flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-white/20 text-xs font-light tracking-wide">
              © {new Date().getFullYear()} CHANDRIKA MAELGE ART. ALL RIGHTS RESERVED.
            </p>
            <p className="text-white/20 text-xs font-light tracking-wide">
              DESIGNED WITH PASSION
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Newsletter Section Component with form functionality
function NewsletterSection() {
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
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/[0.02]" />
      <div className="max-w-4xl mx-auto text-center relative z-10">
        <span className="text-xs tracking-[0.3em] uppercase text-white/40 mb-8 block">Join the Circle</span>
        <h2 className="text-6xl md:text-8xl font-light mb-12 tracking-tight">
          Stay <span className="font-serif italic text-white/80">Inspired</span>
        </h2>
        <p className="text-white/40 text-xl max-w-xl mx-auto mb-16 font-light leading-relaxed">
          Receive exclusive previews of new collections, behind-the-scenes content,
          and invitations to private viewings.
        </p>

        {success ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center gap-4"
          >
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-emerald-400" />
            </div>
            <p className="text-white/60 text-lg">Welcome to the circle! Check your inbox.</p>
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
              className="w-full sm:w-96 px-8 py-5 bg-white/5 border border-white/10 rounded-full text-white placeholder:text-white/20 focus:outline-none focus:border-white/30 transition-colors disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto px-10 py-5 bg-white text-black rounded-full font-medium hover:bg-white/90 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
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
