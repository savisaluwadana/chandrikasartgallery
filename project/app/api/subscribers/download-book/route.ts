import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { EmailSubscriber } from '@/lib/models';
import { sendEmail, getBookDownloadEmailTemplate } from '@/lib/email';

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Create or update subscriber with book download flag
    const subscriber = await EmailSubscriber.findOneAndUpdate(
      { email },
      { downloadedBook: true, downloadDate: new Date() },
      { new: true, upsert: true }
    );

    // Generate download link (in production, this could be a signed URL or direct file link)
    const baseUrl = process.env.NEXTAUTH_URL || process.env.URL || process.env.DEPLOY_PRIME_URL;
    const downloadLink = `${baseUrl}/api/subscribers/download-book/file`;

    // Send download email with the guide
    try {
      const emailTemplate = getBookDownloadEmailTemplate(email, downloadLink);
      await sendEmail({
        to: email,
        subject: emailTemplate.subject,
        html: emailTemplate.html,
        text: emailTemplate.text,
      });
    } catch (emailError) {
      console.error('Download email send failed:', emailError);
      // Continue even if email fails - subscriber record is created
    }

    return NextResponse.json(
      { message: 'Download link sent to your email' },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to process download' },
      { status: 500 }
    );
  }
}
