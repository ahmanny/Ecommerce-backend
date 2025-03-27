import Exception from "../exceptions/Exception";
import NotFoundException from "../exceptions/NotFoundException";
import { createOrder, Order } from "../models/orders.model";
import { getProductById } from "../models/product.model";
import { AddNewOrderPayloadInterface } from "../types/order.types";






class OrderServiceClass {
    constructor() {
        // super()
    }

    // add new order
    public async createNewOrderFunction(payload: AddNewOrderPayloadInterface, userId: string) {
        if (!payload.items || payload.items.length === 0) {
            throw new Exception("Order must contain a product")
        }
        let total_price = 0;
        for (const item of payload.items) {
            const product = await getProductById(item.product_id)
            if (!product) {
                throw new NotFoundException(`Product with ID ${item.product_id} not found`)
            }
            total_price += item.quantity * product.price;
        }
        const new_order = await createOrder({ user_id: userId, total_price: total_price, ...payload })
        return {
            new_order
        }
    }

    // get an order using the id
    public async getOrderByIdFunction(orderId: string) {
        const order = await Order.findById(orderId).populate("user", "name email").populate("items.product_id")
        if (!order) {
            throw new NotFoundException("Order not found")
        }
        return {
            order
        }
    }

    // delete an order
    public async deleteOrderFunction(orderId: string) {
        const order = await Order.findByIdAndDelete(orderId)
        if (!order) {
            throw new NotFoundException("Order not found")
        }
        return { order }
    }
}

export const OrderService = new OrderServiceClass();
