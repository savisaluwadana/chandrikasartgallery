import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { BlogPost } from '@/lib/models';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    const posts = await BlogPost.find({ status: 'published' })
      .populate('author', 'name')
      .sort({ publishDate: -1 })
      .limit(20);

    return NextResponse.json(posts);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch blog posts' },
      { status: 500 }
    );
  }
}
