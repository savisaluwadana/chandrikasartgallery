import { Metadata } from 'next';

export const siteConfig = {
  name: 'Chandrika Maelge Art',
  description: 'Discover beautiful original artworks by Sri Lankan artist Chandrika Maelge. Shop unique paintings, sculptures, and fine art from Colombo, Sri Lanka.',
  url: process.env.NEXTAUTH_URL || 'https://chandrikamaelgeart.com',
  authors: [
    {
      name: 'Chandrika Maelge',
      url: 'https://chandrikamaelgeart.com',
    },
  ],
  links: {
    twitter: 'https://twitter.com/chandrikamaelge',
    instagram: 'https://instagram.com/chandrikamaelgeart',
    facebook: 'https://facebook.com/chandrikamaelgeart',
  },
  creator: 'Chandrika Maelge',
  // Sri Lanka geo-targeting keywords
  keywords: [
    'Sri Lankan artist',
    'Chandrika Maelge',
    'contemporary art Sri Lanka',
    'Colombo art gallery',
    'original paintings Sri Lanka',
    'fine art Sri Lanka',
    'Sri Lankan paintings',
    'art gallery Colombo',
    'handmade art',
    'sculpture Sri Lanka',
    'abstract art',
    'modern art Sri Lanka',
  ],
  // Geo location data
  geo: {
    region: 'LK',
    placename: 'Colombo, Sri Lanka',
    latitude: '6.9271',
    longitude: '79.8612',
  },
  // Currency
  currency: 'LKR',
  locale: 'en-LK',
};

export const defaultMetadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  authors: siteConfig.authors,
  creator: siteConfig.creator,
  metadataBase: new URL(siteConfig.url),
  openGraph: {
    type: 'website',
    locale: 'en_LK',
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: siteConfig.name,
    description: siteConfig.description,
    images: [
      {
        url: `${siteConfig.url}/og-image.png`,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.name,
    description: siteConfig.description,
    images: [`${siteConfig.url}/og-image.png`],
    creator: '@chandrikamaelge',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: siteConfig.url,
    languages: {
      'en-LK': siteConfig.url,
      'en-US': siteConfig.url,
    },
  },
  // Geo meta tags for local SEO
  other: {
    'geo.region': siteConfig.geo.region,
    'geo.placename': siteConfig.geo.placename,
    'geo.position': `${siteConfig.geo.latitude};${siteConfig.geo.longitude}`,
    'ICBM': `${siteConfig.geo.latitude}, ${siteConfig.geo.longitude}`,
  },
};

export function generatePageMetadata(
  title: string,
  description: string,
  image?: string,
  url?: string
): Metadata {
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: url || siteConfig.url,
      type: 'website',
      locale: 'en_LK',
      images: image
        ? [
          {
            url: image,
            width: 1200,
            height: 630,
            alt: title,
          },
        ]
        : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: image ? [image] : undefined,
    },
    alternates: {
      canonical: url || siteConfig.url,
    },
  };
}

// Generate blog post metadata
export function generateBlogMetadata(
  title: string,
  excerpt: string,
  slug: string,
  image?: string,
  publishDate?: Date,
  author?: string
): Metadata {
  const url = `${siteConfig.url}/blog/${slug}`;
  return {
    title,
    description: excerpt,
    openGraph: {
      title,
      description: excerpt,
      url,
      type: 'article',
      locale: 'en_LK',
      publishedTime: publishDate?.toISOString(),
      authors: author ? [author] : [siteConfig.creator],
      images: image
        ? [{ url: image, width: 1200, height: 630, alt: title }]
        : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: excerpt,
      images: image ? [image] : undefined,
    },
    alternates: {
      canonical: url,
    },
  };
}

// Generate product metadata
export function generateProductMetadata(
  title: string,
  description: string,
  productId: string,
  price: number,
  image?: string
): Metadata {
  const url = `${siteConfig.url}/shop/${productId}`;
  return {
    title: `${title} - Original Artwork`,
    description: `${description} Price: Rs. ${price.toLocaleString()}. Original art by Sri Lankan artist Chandrika Maelge.`,
    openGraph: {
      title: `${title} | ${siteConfig.name}`,
      description,
      url,
      type: 'website',
      locale: 'en_LK',
      images: image
        ? [{ url: image, width: 1200, height: 630, alt: title }]
        : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: image ? [image] : undefined,
    },
    alternates: {
      canonical: url,
    },
  };
}
