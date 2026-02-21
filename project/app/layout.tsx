import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { defaultMetadata } from '@/lib/seo';
import { generateOrganizationSchema, generateWebsiteSchema, generateLocalBusinessSchema } from '@/lib/schema';
import { Providers } from './providers';
import { NoiseOverlay } from '@/components/ui/noise-overlay';
import { ScrollProgress } from '@/components/ui/scroll-progress';
import { Navbar } from '@/components/navbar';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  preload: true,
});

export const metadata: Metadata = defaultMetadata;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const organizationSchema = generateOrganizationSchema();
  const websiteSchema = generateWebsiteSchema();
  const localBusinessSchema = generateLocalBusinessSchema();

  return (
    <html lang="en-LK" className="light overflow-x-hidden">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        {/* Geo meta tags for Sri Lanka */}
        <meta name="geo.region" content="LK" />
        <meta name="geo.placename" content="Colombo, Sri Lanka" />
        <meta name="geo.position" content="6.9271;79.8612" />
        <meta name="ICBM" content="6.9271, 79.8612" />

        {/* Language and locale */}
        <link rel="alternate" hrefLang="en-LK" href="https://chandrikamaelgeart.com" />
        <link rel="alternate" hrefLang="x-default" href="https://chandrikamaelgeart.com" />

        {/* Preconnect to external domains for performance */}
        <link rel="preconnect" href="https://res.cloudinary.com" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />

        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
      </head>
      <body className={`${inter.className} bg-white antialiased`}>
        <ScrollProgress />
        <NoiseOverlay />
        <Providers>
          <Navbar />
          {children}
        </Providers>
      </body>
    </html>
  );
}
