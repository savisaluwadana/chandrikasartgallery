import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { connectToDatabase } from '@/lib/mongodb';
import { BlogPost } from '@/lib/models';
import { generateBlogMetadata, siteConfig } from '@/lib/seo';
import { generateBlogPostSchema, generateBreadcrumbSchema } from '@/lib/schema';
import BlogPostContent from './BlogPostContent';

interface Props {
  params: { slug: string };
}

// Generate dynamic metadata for SEO
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    await connectToDatabase();
    const post = await BlogPost.findOne({ slug: params.slug, status: 'published' })
      .populate('author', 'name')
      .lean();

    if (!post) {
      return { title: 'Post Not Found' };
    }

    return generateBlogMetadata(
      post.title,
      post.excerpt || post.content?.substring(0, 160) || '',
      params.slug,
      post.featuredImage,
      post.publishDate,
      post.author?.name
    );
  } catch (error) {
    return { title: 'Blog Post' };
  }
}

// Fetch post data server-side
async function getPost(slug: string) {
  try {
    await connectToDatabase();
    const post = await BlogPost.findOne({ slug, status: 'published' })
      .populate('author', 'name')
      .lean();

    if (post) {
      return JSON.parse(JSON.stringify(post));
    }
    return null;
  } catch (error) {
    console.error('Error fetching post:', error);
    return null;
  }
}

export default async function BlogPostPage({ params }: Props) {
  const post = await getPost(params.slug);

  if (!post) {
    notFound();
  }

  // Generate JSON-LD schemas
  const blogPostSchema = generateBlogPostSchema(
    post.title,
    post.excerpt || post.content?.substring(0, 160) || '',
    post.author?.name || 'Chandrika Maelge',
    new Date(post.publishDate || post.createdAt),
    `${siteConfig.url}/blog/${params.slug}`,
    new Date(post.updatedAt),
    post.featuredImage
  );

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: siteConfig.url },
    { name: 'Journal', url: `${siteConfig.url}/blog` },
    { name: post.title, url: `${siteConfig.url}/blog/${params.slug}` },
  ]);

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <BlogPostContent post={post} />
    </>
  );
}
