import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ImageLibrary } from '@/lib/models';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    const images = await ImageLibrary.find().sort({ uploadDate: -1 }).limit(100);

    return NextResponse.json(images);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch images' },
      { status: 500 }
    );
  }
}
