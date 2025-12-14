import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/seo';
import BlogPageContent from './BlogPageContent';

export const metadata: Metadata = generatePageMetadata(
  'Art Journal - Stories & Insights',
  'Read thoughts on art, creativity, and the artistic journey of Sri Lankan artist Chandrika Maelge. Discover behind-the-scenes insights and inspiration.',
  undefined,
  'https://chandrikamaelgeart.com/blog'
);

// Pre-fetch blog posts for faster initial load
async function getBlogPosts() {
  try {
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/blog/list`, {
      next: { revalidate: 60 }, // Revalidate every 60 seconds
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (error) {
    console.error('Error pre-fetching blog posts:', error);
  }
  return [];
}

export default async function BlogPage() {
  const initialPosts = await getBlogPosts();

  return <BlogPageContent initialPosts={initialPosts} />;
}
