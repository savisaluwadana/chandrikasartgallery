import { NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email';

export async function POST(request: Request) {
    try {
        const { name, email, subject, message } = await request.json();

        if (!name || !email || !message) {
            return NextResponse.json(
                { error: 'Name, email, and message are required' },
                { status: 400 }
            );
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { error: 'Please provide a valid email address' },
                { status: 400 }
            );
        }

        const subjectMap: Record<string, string> = {
            general: 'General Inquiry',
            commission: 'Commission Request',
            purchase: 'Purchase Inquiry',
            collaboration: 'Collaboration',
        };

        const subjectLine = `[${subjectMap[subject] || 'Contact Form'}] from ${name}`;

        // Send email to the admin
        const adminEmail = process.env.ADMIN_EMAIL || process.env.SMTP_FROM_EMAIL;
        if (!adminEmail) {
            console.error('ADMIN_EMAIL not configured');
            return NextResponse.json(
                { error: 'Contact form is not configured. Please try again later.' },
                { status: 500 }
            );
        }

        await sendEmail({
            to: adminEmail,
            subject: subjectLine,
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
            <h1 style="margin: 0; font-size: 24px;">New Contact Form Submission</h1>
          </div>
          <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; border: 1px solid #e0e0e0; border-top: none;">
            <p style="color: #333; margin: 0 0 10px;"><strong>Name:</strong> ${name}</p>
            <p style="color: #333; margin: 0 0 10px;"><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
            <p style="color: #333; margin: 0 0 10px;"><strong>Subject:</strong> ${subjectMap[subject] || subject}</p>
            <hr style="margin: 20px 0; border: none; border-top: 1px solid #e0e0e0;">
            <p style="color: #333; margin: 0 0 10px;"><strong>Message:</strong></p>
            <p style="color: #666; white-space: pre-wrap;">${message}</p>
          </div>
        </div>
      `,
            text: `New Contact Form Submission\n\nName: ${name}\nEmail: ${email}\nSubject: ${subjectMap[subject] || subject}\n\nMessage:\n${message}`,
        });

        // Send confirmation email to the sender
        await sendEmail({
            to: email,
            subject: 'Thank you for contacting Chandrika Maelge Art',
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
            <h1 style="margin: 0; font-size: 24px;">Thank You for Reaching Out</h1>
          </div>
          <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; border: 1px solid #e0e0e0; border-top: none;">
            <p style="color: #333; font-size: 16px; margin-top: 0;">Dear ${name},</p>
            <p style="color: #666; font-size: 14px; line-height: 1.6;">
              Thank you for contacting me. I've received your message and will get back to you as soon as possible.
            </p>
            <p style="color: #666; font-size: 14px; line-height: 1.6;">
              In the meantime, feel free to explore my gallery and collection.
            </p>
            <p style="color: #666; font-size: 14px; margin-top: 30px;">
              Warm regards,<br/>
              <strong>Chandrika Maelge</strong>
            </p>
          </div>
          <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
            <p style="margin: 0;">© ${new Date().getFullYear()} Chandrika Maelge Art. All rights reserved.</p>
          </div>
        </div>
      `,
            text: `Dear ${name},\n\nThank you for contacting me. I've received your message and will get back to you as soon as possible.\n\nIn the meantime, feel free to explore my gallery and collection.\n\nWarm regards,\nChandrika Maelge`,
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Contact form error:', error);
        return NextResponse.json(
            { error: 'Failed to send message. Please try again.' },
            { status: 500 }
        );
    }
}
