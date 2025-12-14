import { NextResponse } from 'next/server';
import { verifyEmailTransporter } from '@/lib/email';

export async function GET() {
    try {
        const result = await verifyEmailTransporter();
        return NextResponse.json(result);
    } catch (error) {
        return NextResponse.json(
            { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}
