import { Metadata } from 'next';
import { generatePageMetadata, siteConfig } from '@/lib/seo';
import { generateImageGallerySchema, generateBreadcrumbSchema } from '@/lib/schema';
import GalleryPageContent from './GalleryPageContent';

export const metadata: Metadata = generatePageMetadata(
  'Art Gallery - Curated Artwork Collection',
  'Explore a curated collection of original artworks by Sri Lankan artist Chandrika Maelge. View paintings, sculptures, and fine art spanning various mediums and styles.',
  undefined,
  'https://chandrikamaelgeart.com/gallery'
);

// Pre-fetch gallery images for faster initial load
async function getGalleryImages() {
  try {
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/images/list`, {
      next: { revalidate: 60 }, // Revalidate every 60 seconds
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (error) {
    console.error('Error pre-fetching gallery images:', error);
  }
  return [];
}

export default async function GalleryPage() {
  const initialImages = await getGalleryImages();

  // Generate JSON-LD schemas
  const gallerySchema = generateImageGallerySchema(
    initialImages.map((img: any) => ({
      url: img.imageUrl,
      title: img.title,
      description: img.category,
    }))
  );

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: siteConfig.url },
    { name: 'Gallery', url: `${siteConfig.url}/gallery` },
  ]);

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(gallerySchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <GalleryPageContent initialImages={initialImages} />
    </>
  );
}
