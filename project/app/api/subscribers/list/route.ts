import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { EmailSubscriber } from '@/lib/models';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    const subscribers = await EmailSubscriber.find()
      .sort({ subscribedDate: -1 })
      .limit(500);

    return NextResponse.json(subscribers);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch subscribers' },
      { status: 500 }
    );
  }
}
