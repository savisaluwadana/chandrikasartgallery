'use client';

import Link from 'next/link';
import { ArrowLeft, ArrowUpRight, Clock, Share2 } from 'lucide-react';
import { AuthNav } from '@/components/auth-nav';

interface BlogPost {
    _id: string;
    title: string;
    content: string;
    author: { name: string };
    publishDate?: Date;
    featuredImage?: string;
    wordCount: number;
}

interface BlogPostContentProps {
    post: BlogPost;
}

export default function BlogPostContent({ post }: BlogPostContentProps) {
    const readingTime = (words: number) => Math.ceil(words / 200);

    const formatDate = (date: Date) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: post.title,
                    url: window.location.href,
                });
            } catch (err) {
                // User cancelled or error
            }
        } else {
            // Fallback: copy to clipboard
            navigator.clipboard.writeText(window.location.href);
            alert('Link copied to clipboard!');
        }
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a]">
            {/* Navigation */}
            <nav className="fixed top-0 w-full z-40 bg-black/80 backdrop-blur-xl border-b border-white/[0.05]">
                <div className="max-w-7xl mx-auto px-6 lg:px-12">
                    <div className="flex items-center justify-between h-20">
                        <Link href="/blog" className="flex items-center gap-3 text-white/60 hover:text-white transition-colors">
                            <ArrowLeft size={18} />
                            <span className="text-sm tracking-wide">Journal</span>
                        </Link>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={handleShare}
                                className="p-2 rounded-full border border-white/10 text-white/60 hover:text-white hover:border-white/20 transition-all"
                                aria-label="Share article"
                            >
                                <Share2 size={16} />
                            </button>
                            <AuthNav />
                        </div>
                    </div>
                </div>
            </nav>

            {/* Article Header */}
            <header className="pt-32 pb-16 px-6 lg:px-12">
                <div className="max-w-3xl mx-auto">
                    {/* Meta */}
                    <div className="flex items-center gap-4 text-xs text-white/40 mb-8">
                        {post.publishDate && (
                            <time dateTime={new Date(post.publishDate).toISOString()}>
                                {formatDate(post.publishDate)}
                            </time>
                        )}
                        <span className="w-1 h-1 rounded-full bg-white/20" />
                        <span className="flex items-center gap-1">
                            <Clock size={12} />
                            {readingTime(post.wordCount)} min read
                        </span>
                    </div>

                    {/* Title */}
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extralight text-white leading-tight mb-8">
                        {post.title}
                    </h1>

                    {/* Author */}
                    <div className="flex items-center gap-4 pt-8 border-t border-white/[0.05]">
                        <div className="w-12 h-12 rounded-full bg-white/[0.05] border border-white/[0.05] flex items-center justify-center">
                            <span className="text-sm font-light text-white/40">
                                {post.author?.name?.charAt(0) || 'A'}
                            </span>
                        </div>
                        <div>
                            <span className="text-white font-light block">{post.author?.name || 'The Artist'}</span>
                            <span className="text-white/40 text-sm">Author</span>
                        </div>
                    </div>
                </div>
            </header>

            {/* Featured Image */}
            {post.featuredImage && (
                <div className="px-6 lg:px-12 mb-16">
                    <div className="max-w-5xl mx-auto">
                        <div className="aspect-[21/9] rounded-2xl overflow-hidden border border-white/[0.05]">
                            <img
                                src={post.featuredImage}
                                alt={post.title}
                                className="w-full h-full object-cover"
                                loading="eager"
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Content */}
            <article className="px-6 lg:px-12 pb-20">
                <div className="max-w-3xl mx-auto">
                    <div className="prose prose-lg prose-invert max-w-none">
                        <p className="text-lg text-white/70 leading-relaxed font-light whitespace-pre-wrap">
                            {post.content}
                        </p>
                    </div>
                </div>
            </article>

            {/* Share & Tags */}
            <div className="px-6 lg:px-12 pb-20">
                <div className="max-w-3xl mx-auto">
                    <div className="flex items-center justify-between py-8 border-t border-white/[0.05]">
                        <span className="text-white/40 text-sm">{post.wordCount} words</span>
                        <button
                            onClick={handleShare}
                            className="flex items-center gap-2 text-white/60 hover:text-white transition-colors"
                        >
                            <Share2 size={16} />
                            <span className="text-sm">Share</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Subscribe CTA */}
            <section className="px-6 lg:px-12 pb-20">
                <div className="max-w-3xl mx-auto">
                    <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-10 text-center relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-amber-500/5 to-transparent rounded-full blur-3xl" />
                        <div className="relative z-10">
                            <h2 className="text-2xl font-light text-white mb-3">
                                Enjoyed this article?
                            </h2>
                            <p className="text-white/40 mb-8 font-light">
                                Subscribe to receive new stories directly in your inbox
                            </p>
                            <Link href="/subscribe" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black rounded-full font-medium hover:bg-white/90 transition-all">
                                Subscribe to Newsletter
                                <ArrowUpRight size={16} />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* More Articles */}
            <section className="border-t border-white/[0.05] py-20 px-6 lg:px-12">
                <div className="max-w-7xl mx-auto text-center">
                    <h2 className="text-2xl font-light text-white mb-4">
                        Continue Reading
                    </h2>
                    <Link href="/blog" className="inline-flex items-center gap-2 px-6 py-3 border border-white/20 text-white rounded-full font-light hover:bg-white/5 transition-all">
                        View All Articles
                        <ArrowUpRight size={16} />
                    </Link>
                </div>
            </section>
        </div>
    );
}
