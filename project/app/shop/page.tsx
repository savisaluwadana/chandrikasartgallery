import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/seo';
import ShopPageContent from './ShopPageContent';

export const metadata: Metadata = generatePageMetadata(
  'Art Collection - Original Paintings & Sculptures',
  'Shop original artworks, paintings, and sculptures by Sri Lankan artist Chandrika Maelge. Unique handmade art pieces available for collectors in Colombo and worldwide.',
  undefined,
  'https://chandrikamaelgeart.com/shop'
);

// Pre-fetch products for faster initial load
async function getProducts() {
  try {
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/shop/products`, {
      next: { revalidate: 60 }, // Revalidate every 60 seconds
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (error) {
    console.error('Error pre-fetching products:', error);
  }
  return [];
}

export default async function ShopPage() {
  const initialProducts = await getProducts();

  return <ShopPageContent initialProducts={initialProducts} />;
}
