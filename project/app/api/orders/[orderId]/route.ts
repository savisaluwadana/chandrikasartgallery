import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Order from '@/lib/models/Order';

interface Params {
    params: { orderId: string };
}

// PATCH /api/orders/[orderId] — update order status
export async function PATCH(request: Request, { params }: Params) {
    try {
        const { orderId } = params;
        const body = await request.json();
        const { status, paymentStatus } = body;

        const validStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
        const validPaymentStatuses = ['pending', 'paid', 'failed', 'refunded'];

        if (status && !validStatuses.includes(status)) {
            return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
        }
        if (paymentStatus && !validPaymentStatuses.includes(paymentStatus)) {
            return NextResponse.json({ error: 'Invalid payment status' }, { status: 400 });
        }

        await connectToDatabase();

        const update: Record<string, string> = {};
        if (status) update.status = status;
        if (paymentStatus) update.paymentStatus = paymentStatus;

        const order = await Order.findOneAndUpdate(
            { orderId },
            { $set: update },
            { new: true }
        );

        if (!order) {
            return NextResponse.json({ error: 'Order not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, order });
    } catch (error) {
        console.error('Error updating order:', error);
        return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
    }
}

// GET /api/orders/[orderId] — fetch single order
export async function GET(request: Request, { params }: Params) {
    try {
        const { orderId } = params;
        await connectToDatabase();
        const order = await Order.findOne({ orderId }).lean();
        if (!order) {
            return NextResponse.json({ error: 'Order not found' }, { status: 404 });
        }
        return NextResponse.json(order);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch order' }, { status: 500 });
    }
}
