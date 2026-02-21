'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';

import { Hero } from '@/components/home/Hero';
import { Footer } from '@/components/home/Footer';

// Lazy load heavy components below the fold
const Featured = dynamic(() => import('@/components/home/Featured').then(mod => mod.Featured), {
  loading: () => <div className="h-96 w-full bg-gray-50" />
});
const Services = dynamic(() => import('@/components/home/Services').then(mod => mod.Services), {
  loading: () => <div className="h-96 w-full bg-gray-50" />
});
const Newsletter = dynamic(() => import('@/components/home/Newsletter').then(mod => mod.Newsletter), {
  loading: () => <div className="h-96 w-full bg-gray-50" />
});
const ShopCategories = dynamic(() => import('@/components/home/ShopCategories').then(mod => mod.ShopCategories), {
  loading: () => <div className="h-96 w-full bg-white" />
});
const Marquee = dynamic(() => import('@/components/home/Marquee').then(mod => mod.Marquee), {
  loading: () => <div className="h-24 w-full bg-white" />
});

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '/shop', label: 'Gift Shop' },
    { href: '/gallery', label: 'Gallery' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
    { href: '/blog', label: 'Journal' },
    { href: '/subscribe', label: 'Subscribe' },
  ];

  return (
    <div className="min-h-screen bg-white text-black selection:bg-black/5">
      <Hero />
      <Marquee />
      <Featured />
      <ShopCategories />
      <Services />
      <Newsletter />
      <Footer />
    </div>
  );
}
