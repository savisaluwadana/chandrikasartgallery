import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { connectToDatabase } from '@/lib/mongodb';
import { ArtProduct } from '@/lib/models';
import { generateProductMetadata, siteConfig } from '@/lib/seo';
import { generateProductSchema, generateBreadcrumbSchema } from '@/lib/schema';
import ProductPageContent from './ProductPageContent';

interface Props {
  params: { id: string };
}

// Define the product type for TypeScript
interface ProductDocument {
  _id: string;
  title: string;
  description?: string;
  price: number;
  images?: string[];
  status?: string;
  category?: string;
  hasPrints?: boolean;
  dimensions?: { width?: number; height?: number; depth?: number };
  variants?: Array<{
    type: string;
    price: number;
    dimensions?: string;
    material?: string;
  }>;
}

// Generate dynamic metadata for SEO
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    await connectToDatabase();
    const product = await ArtProduct.findById(params.id).lean<ProductDocument>();

    if (!product) {
      return { title: 'Product Not Found' };
    }

    return generateProductMetadata(
      product.title,
      product.description || '',
      params.id,
      product.price,
      product.images?.[0]
    );
  } catch (error) {
    return { title: 'Artwork' };
  }
}

// Fetch product data server-side
async function getProduct(id: string) {
  try {
    await connectToDatabase();
    const product = await ArtProduct.findById(id).lean<ProductDocument>();

    if (product) {
      return JSON.parse(JSON.stringify(product));
    }
    return null;
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}

export default async function ProductPage({ params }: Props) {
  const product = await getProduct(params.id);

  if (!product) {
    notFound();
  }

  // Generate JSON-LD schemas
  const productSchema = generateProductSchema(
    product.title,
    product.description || '',
    product.price,
    params.id,
    product.images?.[0],
    product.status === 'available' ? 'InStock' : 'OutOfStock',
    product.category
  );

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: siteConfig.url },
    { name: 'Gift Shop', url: `${siteConfig.url}/shop` },
    { name: product.title, url: `${siteConfig.url}/shop/${params.id}` },
  ]);

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <ProductPageContent product={product} />
    </>
  );
}
