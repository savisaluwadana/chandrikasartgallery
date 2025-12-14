import mongoose, { Schema, Document } from 'mongoose';

export interface IOrderItem {
    productId: string;
    title: string;
    price: number;
    quantity: number;
    image?: string;
}

export interface IOrder extends Document {
    orderId: string;
    customer: {
        name: string;
        email: string;
        phone: string;
        address: {
            street: string;
            city: string;
            postalCode: string;
            country: string;
        };
    };
    items: IOrderItem[];
    subtotal: number;
    shipping: number;
    total: number;
    status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
}

const orderItemSchema = new Schema<IOrderItem>({
    productId: { type: String, required: true },
    title: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 },
    image: { type: String },
});

const orderSchema = new Schema<IOrder>(
    {
        orderId: {
            type: String,
            required: true,
            unique: true,
        },
        customer: {
            name: { type: String, required: true },
            email: { type: String, required: true },
            phone: { type: String, required: true },
            address: {
                street: { type: String, required: true },
                city: { type: String, required: true },
                postalCode: { type: String, required: true },
                country: { type: String, required: true, default: 'Sri Lanka' },
            },
        },
        items: [orderItemSchema],
        subtotal: { type: Number, required: true },
        shipping: { type: Number, required: true, default: 0 },
        total: { type: Number, required: true },
        status: {
            type: String,
            enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
            default: 'pending',
        },
        paymentStatus: {
            type: String,
            enum: ['pending', 'paid', 'failed', 'refunded'],
            default: 'pending',
        },
        notes: { type: String },
    },
    { timestamps: true }
);

// Index for faster queries
orderSchema.index({ orderId: 1 });
orderSchema.index({ 'customer.email': 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ createdAt: -1 });

export default mongoose.models.Order || mongoose.model<IOrder>('Order', orderSchema);
