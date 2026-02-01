
import mongoose from 'mongoose';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error('Please define the MONGODB_URI environment variable inside .env.local');
    process.exit(1);
}

// Define Schema inline to avoid import issues
const artProductSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        description: { type: String, required: true },
        images: { type: [String], required: true },
        price: { type: Number, required: true, min: 0 },
        category: {
            type: String,
            required: true,
            enum: ['painting', 'sculpture', 'print', 'craft', 'screensaver', 'necklace', 'other'],
        },
        status: {
            type: String,
            enum: ['available', 'sold'],
            default: 'available',
        },
        hasPrints: { type: Boolean, default: false },
        variants: [{
            type: { type: String, required: true },
            price: { type: Number, required: true },
            dimensions: { type: String },
            material: { type: String },
        }],
        dimensions: {
            width: Number,
            height: Number,
            depth: Number,
        },
    },
    { timestamps: true }
);

const ArtProduct = mongoose.models.ArtProduct || mongoose.model('ArtProduct', artProductSchema);

async function seed() {
    try {
        await mongoose.connect(MONGODB_URI as string);
        console.log('Connected to MongoDB');

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

        // Optional: Clear existing screensavers/necklaces to avoid dupes if re-run
        // await ArtProduct.deleteMany({ category: { $in: ['screensaver', 'necklace'] } });

        await ArtProduct.insertMany([...screensavers, ...necklaces]);
        console.log('Successfully seeded 10 products (5 Screensavers, 5 Necklaces)');

        process.exit(0);
    } catch (error) {
        console.error('Seed error:', error);
        process.exit(1);
    }
}

seed();
