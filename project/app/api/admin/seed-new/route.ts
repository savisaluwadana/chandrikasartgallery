import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import ArtProduct from '@/lib/models/ArtProduct';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        await connectToDatabase();

        const screensavers = Array.from({ length: 5 }).map((_, i) => ({
            title: `Digital Art Screensaver ${i + 1}`,
            description: 'High-resolution artistic screensaver for your desktop and mobile devices. Features calming abstract patterns and vibrant colors.',
            price: 450,
            category: 'screensaver',
            status: 'available',
            images: ['https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=1000&auto=format&fit=crop'],
            hasPrints: false,
            variants: [
                { type: 'Desktop 4K', price: 450, dimensions: '3840x2160', material: 'Digital Download' },
                { type: 'Mobile HD', price: 250, dimensions: '1080x1920', material: 'Digital Download' }
            ]
        }));

        const necklaces = Array.from({ length: 5 }).map((_, i) => ({
            title: `Artistic Pendant Necklace ${i + 1}`,
            description: 'Handcrafted necklace featuring a unique miniature art piece encased in glass. Perfect for art lovers.',
            price: 4500,
            category: 'necklace',
            status: 'available',
            images: ['https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=1000&auto=format&fit=crop'],
            hasPrints: false,
            variants: [
                { type: 'Gold Chain', price: 5500, dimensions: '18 inch', material: '18k Gold Plated' },
                { type: 'Silver Chain', price: 4500, dimensions: '18 inch', material: 'Sterling Silver' }
            ]
        }));

        await ArtProduct.insertMany([...screensavers, ...necklaces]);

        return NextResponse.json({ success: true, message: 'Seeded 10 products successfully' });
    } catch (error) {
        console.error('Seed error:', error);
        return NextResponse.json({
            error: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}
