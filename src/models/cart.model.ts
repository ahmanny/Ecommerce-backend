import mongoose, { Schema, Types } from "mongoose";

export interface ICartItem {
    productId: Types.ObjectId;
    quantity: number;
    color: string;
    size: string;
}

interface ICart {
    user: Types.ObjectId;
    items: ICartItem[];
}

export const CartItemSchema = new Schema<ICartItem>({
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    quantity: { type: Number, required: true },
    color: { type: String, required: true },
    size: { type: String, required: true },
});

const CartSchema = new Schema<ICart>({
    user: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    items: [CartItemSchema],
});

export const Cart = mongoose.model<ICart>("Cart", CartSchema);
