import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Order from '@/lib/models/Order';
import { sendEmail, getOrderConfirmationEmailTemplate } from '@/lib/email';

// Generate unique order ID
function generateOrderId(): string {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `CMA-${timestamp}-${random}`;
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { customer, items, subtotal, shipping = 0, notes } = body;

        // Validation
        if (!customer?.name || !customer?.email || !customer?.phone) {
            return NextResponse.json(
                { error: 'Customer name, email, and phone are required' },
                { status: 400 }
            );
        }

        if (!customer?.address?.street || !customer?.address?.city || !customer?.address?.postalCode) {
            return NextResponse.json(
                { error: 'Complete address is required' },
                { status: 400 }
            );
        }

        if (!items || !Array.isArray(items) || items.length === 0) {
            return NextResponse.json(
                { error: 'Order must contain at least one item' },
                { status: 400 }
            );
        }

        await connectToDatabase();

        const orderId = generateOrderId();
        const total = subtotal + shipping;

        const order = new Order({
            orderId,
            customer: {
                ...customer,
                address: {
                    ...customer.address,
                    country: customer.address.country || 'Sri Lanka',
                },
            },
            items,
            subtotal,
            shipping,
            total,
            notes,
            status: 'pending',
            paymentStatus: 'pending',
        });

        await order.save();

        // Send confirmation email to customer
        try {
            const itemsList = items.map((item: any) => `${item.title} x${item.quantity}`).join(', ');
            await sendEmail({
                to: customer.email,
                subject: `Order Confirmation - ${orderId}`,
                html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
              <h1 style="margin: 0; font-size: 28px;">Order Confirmed!</h1>
              <p style="margin: 10px 0 0 0; opacity: 0.9;">Thank you for your order</p>
            </div>
            <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; border: 1px solid #e0e0e0; border-top: none;">
              <p style="color: #333; font-size: 16px; margin-top: 0;">Dear ${customer.name},</p>
              <p style="color: #666; font-size: 14px; line-height: 1.6;">
                Thank you for your order! We've received it and will begin processing shortly.
              </p>
              <div style="background: white; border: 1px solid #e0e0e0; border-radius: 6px; padding: 20px; margin: 20px 0;">
                <p style="color: #333; margin: 0 0 10px;"><strong>Order ID:</strong> ${orderId}</p>
                <p style="color: #333; margin: 0 0 10px;"><strong>Items:</strong> ${itemsList}</p>
                <p style="color: #333; margin: 0 0 10px;"><strong>Subtotal:</strong> Rs. ${subtotal.toLocaleString()}</p>
                ${shipping > 0 ? `<p style="color: #333; margin: 0 0 10px;"><strong>Shipping:</strong> Rs. ${shipping.toLocaleString()}</p>` : ''}
                <p style="color: #333; margin: 0; font-size: 16px;"><strong>Total:</strong> Rs. ${total.toLocaleString()}</p>
              </div>
              <div style="background: #fff3cd; border: 1px solid #ffc107; border-radius: 6px; padding: 15px; margin: 20px 0;">
                <p style="color: #856404; margin: 0; font-size: 14px;">
                  <strong>Payment Instructions:</strong> We will contact you shortly with payment details and to confirm your order.
                </p>
              </div>
              <p style="color: #666; font-size: 14px; margin-top: 20px;">
                <strong>Shipping Address:</strong><br/>
                ${customer.address.street}<br/>
                ${customer.address.city}, ${customer.address.postalCode}<br/>
                ${customer.address.country || 'Sri Lanka'}
              </p>
              <p style="color: #666; font-size: 14px; margin-top: 30px;">
                Warm regards,<br/>
                <strong>Chandrika Maelge Art</strong>
              </p>
            </div>
            <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
              <p style="margin: 0;">© ${new Date().getFullYear()} Chandrika Maelge Art. All rights reserved.</p>
            </div>
          </div>
        `,
                text: `Order Confirmation - ${orderId}\n\nDear ${customer.name},\n\nThank you for your order!\n\nOrder ID: ${orderId}\nItems: ${itemsList}\nTotal: Rs. ${total.toLocaleString()}\n\nWe will contact you shortly with payment details.\n\nWarm regards,\nChandrika Maelge Art`,
            });

            // Send notification to admin
            const adminEmail = process.env.ADMIN_EMAIL || process.env.SMTP_FROM_EMAIL;
            if (adminEmail) {
                await sendEmail({
                    to: adminEmail,
                    subject: `New Order Received - ${orderId}`,
                    html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <h1 style="color: #333;">New Order Received!</h1>
              <p><strong>Order ID:</strong> ${orderId}</p>
              <p><strong>Customer:</strong> ${customer.name} (${customer.email})</p>
              <p><strong>Phone:</strong> ${customer.phone}</p>
              <p><strong>Items:</strong> ${itemsList}</p>
              <p><strong>Total:</strong> Rs. ${total.toLocaleString()}</p>
              <p><strong>Address:</strong> ${customer.address.street}, ${customer.address.city}, ${customer.address.postalCode}</p>
              ${notes ? `<p><strong>Notes:</strong> ${notes}</p>` : ''}
            </div>
          `,
                    text: `New Order: ${orderId}\nCustomer: ${customer.name}\nEmail: ${customer.email}\nPhone: ${customer.phone}\nTotal: Rs. ${total.toLocaleString()}`,
                });
            }
        } catch (emailError) {
            console.error('Failed to send order confirmation email:', emailError);
            // Don't fail the order if email fails
        }

        return NextResponse.json({
            success: true,
            orderId,
            order: {
                orderId: order.orderId,
                total: order.total,
                status: order.status,
            },
        });
    } catch (error) {
        console.error('Order creation error:', error);
        return NextResponse.json(
            { error: 'Failed to create order. Please try again.' },
            { status: 500 }
        );
    }
}
