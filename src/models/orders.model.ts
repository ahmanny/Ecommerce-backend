import { Schema, Types, model } from 'mongoose';
import { CartItemSchema, ICartItem } from './cart.model';

export interface IShippingDetails {
    email: string;
    address: string;
    name: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
}
export interface IOrderSummary {
    subtotal: number;
    tax: number;
    total: number;
}
export interface IOrder {
    user: Types.ObjectId;
    items: ICartItem[];
    shippingDetails: IShippingDetails
    summary: IOrderSummary
    payment_status: "pending" | "paid" | "failed"
    order_status: "pending" | "processing" | "shipped" | "delivered" | "canceled";
}
// schemas
export const ShippingDetailsSchema = new Schema<IShippingDetails>({
    name: { type: String, required: true },
    email: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
    country: { type: String, required: true },
});


const OrderSummarySchema = new Schema<IOrderSummary>({
    subtotal: { type: Number, required: true },
    tax: { type: Number, required: true },
    total: { type: Number, required: true },
});

const OrderSchema = new Schema<IOrder>({
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    items: [CartItemSchema],
    shippingDetails: ShippingDetailsSchema,
    summary: OrderSummarySchema,
    payment_status: {
        type: String,
        enum: ["pending", "paid", "failed"],
        default: "pending"
    },
    order_status: {
        type: String,
        enum: ["pending", "processing", "shipped", "delivered", "canceled"],
        default: "pending"
    },

}, { timestamps: true });


export const Order = model<IOrder>('Order', OrderSchema);







//methods
export const getOrders = () => Order.find();
export const getOrderById = (id: String) => Order.findById(id).lean();
export const createOrder = (values: Record<string, any>) => new Order(values).save().then((order) => order.toObject());
export const deleteOrderById = (id: string) => Order.findByIdAndDelete({ _id: id });
export const updateOrderById = (id: string, values: Record<string, any>) => Order.findByIdAndUpdate(id, values)
