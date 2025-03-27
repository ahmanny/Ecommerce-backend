import { Schema, Types, model } from 'mongoose';
import { Product } from './product.model';

interface IOrder {
    user_id: Types.ObjectId;
    items: {
        product_id: Types.ObjectId;
        quantity: number;
    }
    payment_status: "pending" | "paid" | "failed"
    total_price: number;
    order_status: "pending" | "processing" | "shipped" | "delivered" | "canceled";
    createdAt: Date;
    updatedAt: Date;
}

const OrderSchema = new Schema<IOrder>({
    user_id: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    items: [
        {
            product_id: {
                type: Schema.Types.ObjectId,
                required: true,
                ref: Product
            },
            quantity: {
                type: Number,
                required: true,
                min: 1
            },
        }
    ],
    payment_status: {
        type: String,
        enum: ["pending", "paid", "failed"],
        default: "pending"
    },
    total_price: {
        type: Number,
        required: true,
    },
    order_status: {
        type: String,
        enum: ["pending", "processing", "shipped", "delivered", "canceled"],
        default: "pending"
    },

},
    { timestamps: true });

export const Order = model<IOrder>('Order', OrderSchema);






//methods
export const getOrders = () => Order.find();
export const getOrderById = (id: String) => Order.findById(id).lean();
export const createOrder = (values: Record<string, any>) => new Order(values).save().then((order) => order.toObject());
export const deleteOrderById = (id: string) => Order.findByIdAndDelete({ _id: id });
export const updateOrderById = (id: string, values: Record<string, any>) => Order.findByIdAndUpdate(id, values)
