import { siteConfig } from './seo';

// Organization schema with Sri Lanka location
export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'ArtGallery',
    name: siteConfig.name,
    url: siteConfig.url,
    logo: `${siteConfig.url}/logo.png`,
    image: `${siteConfig.url}/og-image.png`,
    description: siteConfig.description,
    sameAs: Object.values(siteConfig.links),
    foundingDate: '2024',
    founder: {
      '@type': 'Person',
      name: siteConfig.creator,
      jobTitle: 'Artist',
      nationality: 'Sri Lankan',
    },
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Colombo',
      addressRegion: 'Western Province',
      addressCountry: 'LK',
      postalCode: '00100',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: siteConfig.geo.latitude,
      longitude: siteConfig.geo.longitude,
    },
    areaServed: {
      '@type': 'Country',
      name: 'Sri Lanka',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Support',
      email: process.env.ADMIN_EMAIL || 'contact@chandrikamaelgeart.com',
      availableLanguage: ['English', 'Sinhala'],
    },
    priceRange: '$$',
    currenciesAccepted: 'LKR',
  };
}

// Blog post schema
export function generateBlogPostSchema(
  title: string,
  description: string,
  author: string,
  datePublished: Date,
  url: string,
  dateModified?: Date,
  image?: string
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: title,
    description: description,
    image: image,
    url: url,
    author: {
      '@type': 'Person',
      name: author,
      url: siteConfig.url,
    },
    publisher: {
      '@type': 'Organization',
      name: siteConfig.name,
      logo: {
        '@type': 'ImageObject',
        url: `${siteConfig.url}/logo.png`,
      },
    },
    datePublished: datePublished.toISOString(),
    dateModified: (dateModified || datePublished).toISOString(),
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
    inLanguage: 'en-LK',
  };
}

// Product schema with LKR pricing
export function generateProductSchema(
  name: string,
  description: string,
  price: number,
  productId: string,
  image?: string,
  availability: 'InStock' | 'OutOfStock' = 'InStock',
  category?: string
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: name,
    description: description,
    image: image,
    sku: productId,
    brand: {
      '@type': 'Brand',
      name: siteConfig.name,
    },
    offers: {
      '@type': 'Offer',
      url: `${siteConfig.url}/shop/${productId}`,
      availability: `https://schema.org/${availability}`,
      priceCurrency: 'LKR',
      price: price.toString(),
      seller: {
        '@type': 'Organization',
        name: siteConfig.name,
      },
      shippingDetails: {
        '@type': 'OfferShippingDetails',
        shippingDestination: {
          '@type': 'DefinedRegion',
          addressCountry: 'LK',
        },
      },
    },
    category: category || 'Art',
    manufacturer: {
      '@type': 'Person',
      name: siteConfig.creator,
    },
  };
}

// Image gallery schema
export function generateImageGallerySchema(
  images: Array<{ url: string; title: string; description?: string }>
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ImageGallery',
    name: 'Art Gallery - Chandrika Maelge',
    description: 'A curated collection of original artworks by Sri Lankan artist Chandrika Maelge',
    url: `${siteConfig.url}/gallery`,
    author: {
      '@type': 'Person',
      name: siteConfig.creator,
    },
    image: images.map((img) => ({
      '@type': 'ImageObject',
      url: img.url,
      name: img.title,
      description: img.description,
    })),
  };
}

// Breadcrumb schema
export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

// Local business schema for Sri Lanka
export function generateLocalBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': siteConfig.url,
    name: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    image: `${siteConfig.url}/og-image.png`,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Colombo',
      addressRegion: 'Western Province',
      addressCountry: 'Sri Lanka',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: siteConfig.geo.latitude,
      longitude: siteConfig.geo.longitude,
    },
    areaServed: ['Sri Lanka', 'Colombo', 'Kandy', 'Galle'],
    priceRange: '$$',
    currenciesAccepted: 'LKR',
  };
}

// Website schema for search box
export function generateWebsiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    inLanguage: 'en-LK',
    publisher: {
      '@type': 'Organization',
      name: siteConfig.name,
      url: siteConfig.url,
    },
  };
}
