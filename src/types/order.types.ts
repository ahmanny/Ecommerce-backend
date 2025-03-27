import { Types } from "mongoose";



interface item {
    product_id: Types.ObjectId;
    quantity: number;
}

export interface AddNewOrderPayloadInterface {
    items: item[];
    payment_status: "pending" | "paid" | "failed"
    order_status: "pending" | "processing" | "shipped" | "delivered" | "canceled";
}


