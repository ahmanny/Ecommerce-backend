import { Types } from "mongoose";
import { ICartItem } from "../models/cart.model";
import { IOrderSummary, IShippingDetails } from "../models/orders.model";



interface item {
    product_id: Types.ObjectId;
    quantity: number;
}

export interface AddNewOrderPayloadInterface {
    items: ICartItem[];
    shippingDetails: IShippingDetails
    summary: IOrderSummary
    payment_status: "pending" | "paid" | "failed"
    order_status: "pending" | "processing" | "shipped" | "delivered" | "canceled";
}


