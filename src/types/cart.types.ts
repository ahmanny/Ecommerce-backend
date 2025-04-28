import { Types } from "mongoose";
import { ICartItem } from "../models/cart.model";

export interface CartItemInterfacePayload {
    productId: Types.ObjectId;
    quantity: number;
    color: string;
    size: string;
}

export interface CartInterfacePayload {
    user: string;
    items: ICartItem[];
}
export interface AddToCartInterfacePayload {
    user: string;
    items: ICartItem;
}

export interface GetCartInterfacePayload {
    userId: string
}

export interface deleteCartPayloadInterface {
    deleteId: string;
    userId: string;
}