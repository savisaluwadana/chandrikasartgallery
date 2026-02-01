'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Loader2, ArrowRight, ArrowUpRight, Clock, ArrowDown } from 'lucide-react';
import { PageHeader } from '@/components/page-header';
import { OptimizedImage } from '@/components/OptimizedImage';
import { motion } from 'framer-motion';

interface BlogPost {
    _id: string;
    title: string;
    excerpt?: string;
    slug: string;
    content: string;
    author: { name: string };
    publishDate?: Date;
    featuredImage?: string;
    wordCount: number;
}

interface BlogPageContentProps {
    initialPosts: BlogPost[];
}

const POSTS_PER_PAGE = 6;

export default function BlogPageContent({ initialPosts }: BlogPageContentProps) {
    const [posts, setPosts] = useState<BlogPost[]>(initialPosts);
    const [loading, setLoading] = useState(initialPosts.length === 0);

    // Pagination state
    const [page, setPage] = useState(1);

    useEffect(() => {
        // Only fetch if no initial posts were provided
        if (initialPosts.length === 0) {
            const fetchPosts = async () => {
                try {
                    const res = await fetch('/api/blog/list');
                    if (res.ok) {
                        const data = await res.json();
                        setPosts(data);
                    }
                } catch (error) {
                    console.error('Error fetching blog posts:', error);
                } finally {
                    setLoading(false);
                }
            };
            fetchPosts();
        }
    }, [initialPosts.length]);

    // Pagination logic
    const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);
    const displayedPosts = posts.slice(0, page * POSTS_PER_PAGE);

    const formatDate = (date: Date) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const readingTime = (words: number) => Math.ceil(words / 200);

    return (
        <div className="min-h-screen bg-white">
            {/* Navigation */}
            <PageHeader title="Journal" />

            {/* Hero Header */}
            <section className="pt-32 pb-20 px-6 lg:px-12 relative overflow-hidden bg-[#6CD8D1] rounded-b-[2rem] mb-12">
                <div className="absolute inset-0">
                    <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-white/20 rounded-full blur-3xl opacity-50" />
                </div>
                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="inline-flex items-center gap-3 mb-6">
                        <div className="w-12 h-[1px] bg-black/40" />
                        <span className="text-xs tracking-[0.3em] uppercase text-black/60">Stories & Insights</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-extralight text-black mb-6">
                        The <span className="font-medium text-black">Journal</span>
                    </h1>
                    <p className="text-lg text-black/40 max-w-xl font-light">
                        Thoughts on art, creativity, and the journey of bringing visions to life.
                    </p>
                </div>
            </section>

            {/* Content */}
            <section className="px-6 lg:px-12 pb-32">
                <div className="max-w-4xl mx-auto">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-32">
                            <Loader2 className="h-8 w-8 animate-spin text-black/40 mb-4" />
                            <span className="text-black/40 text-sm">Loading articles...</span>
                        </div>
                    ) : posts.length === 0 ? (
                        <div className="text-center py-32">
                            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-black/[0.03] border border-black/[0.05] mb-6">
                                <span className="text-3xl font-light text-black/20">✎</span>
                            </div>
                            <h3 className="text-2xl font-light text-black mb-3">No Articles Yet</h3>
                            <p className="text-black/40 mb-8">Stories are being written. Subscribe to get notified.</p>
                            <Link href="/subscribe" className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white rounded-full font-medium hover:bg-black/90 transition-all">
                                Subscribe for Updates
                                <ArrowUpRight size={16} />
                            </Link>
                        </div>
                    ) : (
                        <>
                            <div className="space-y-1">
                                {displayedPosts.map((post, idx) => (
                                    <motion.div
                                        key={post._id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.5, delay: (idx % POSTS_PER_PAGE) * 0.1 }}
                                    >
                                        <Link href={`/blog/${post.slug}`}>
                                            <article className="group py-10 border-b border-black/[0.05] hover:bg-black/[0.01] transition-all -mx-6 px-6 rounded-lg">
                                                <div className="flex flex-col md:flex-row gap-8">
                                                    {/* Image */}
                                                    {post.featuredImage && (
                                                        <div className="w-full md:w-48 h-48 md:h-32 rounded-xl overflow-hidden flex-shrink-0 border border-black/[0.05] relative bg-black/[0.02]">
                                                            <OptimizedImage
                                                                src={post.featuredImage}
                                                                alt={post.title}
                                                                fill
                                                                className="group-hover:scale-105 transition-transform duration-500"
                                                                sizes="(max-width: 768px) 100vw, 200px"
                                                            />
                                                        </div>
                                                    )}

                                                    {/* Content */}
                                                    <div className="flex-1 min-w-0">
                                                        {/* Meta */}
                                                        <div className="flex items-center gap-4 text-xs text-black/40 mb-4">
                                                            {post.publishDate && (
                                                                <span>{formatDate(post.publishDate)}</span>
                                                            )}
                                                            <span className="w-1 h-1 rounded-full bg-black/20" />
                                                            <span className="flex items-center gap-1">
                                                                <Clock size={12} />
                                                                {readingTime(post.wordCount)} min read
                                                            </span>
                                                        </div>

                                                        {/* Title */}
                                                        <h2 className="text-2xl font-light text-black mb-3 group-hover:text-[#6CD8D1] transition-colors leading-snug">
                                                            {post.title}
                                                        </h2>

                                                        {/* Excerpt */}
                                                        <p className="text-black/40 text-sm leading-relaxed mb-4 line-clamp-2 font-light">
                                                            {post.excerpt || post.content?.substring(0, 150)}...
                                                        </p>

                                                        {/* Read More */}
                                                        <span className="inline-flex items-center gap-2 text-sm text-black/60 group-hover:text-black transition-colors">
                                                            Read Article
                                                            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                                        </span>
                                                    </div>

                                                    {/* Number */}
                                                    <div className="hidden lg:flex items-start">
                                                        <span className="text-5xl font-extralight text-black/[0.05] group-hover:text-black/[0.1] transition-colors">
                                                            {String(idx + 1).padStart(2, '0')}
                                                        </span>
                                                    </div>
                                                </div>
                                            </article>
                                        </Link>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Load More Button */}
                            {page < totalPages && (
                                <div className="mt-16 flex justify-center">
                                    <button
                                        onClick={() => setPage(p => p + 1)}
                                        className="group flex flex-col items-center gap-2 text-black/40 hover:text-black transition-colors"
                                    >
                                        <span className="text-sm tracking-[0.2em] uppercase">Load More</span>
                                        <div className="w-10 h-10 rounded-full border border-black/10 flex items-center justify-center group-hover:bg-black/5 transition-all">
                                            <ArrowDown size={16} className="animate-bounce" />
                                        </div>
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </section>

            {/* Subscribe CTA */}
            <section className="border-t border-black/[0.05] py-20 px-6 lg:px-12">
                <div className="max-w-7xl mx-auto text-center">
                    <h2 className="text-3xl font-light text-black mb-4">
                        Never Miss a Story
                    </h2>
                    <p className="text-black/40 mb-8 font-light">
                        Subscribe to receive new articles directly in your inbox
                    </p>
                    <Link href="/subscribe" className="inline-flex items-center gap-2 px-8 py-4 bg-black text-white rounded-full font-medium hover:bg-black/90 transition-all">
                        Subscribe Now
                        <ArrowUpRight size={16} />
                    </Link>
                </div>
            </section>
        </div>
    );
}
