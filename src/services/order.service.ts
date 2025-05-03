import Exception from "../exceptions/Exception";
import ResourceNotFoundException from "../exceptions/ResourceNotFoundException";
import { Cart } from "../models/cart.model";
import { createOrder, Order } from "../models/orders.model";
import { getProductById } from "../models/product.model";
import { AddNewOrderPayloadInterface } from "../types/order.types";
import { ensureArray } from "../utils/cart.utils";

class OrderServiceClass {
    // Add new order
    public async createNewOrderFunction(payload: AddNewOrderPayloadInterface, userId: string) {
        if (!payload.items || payload.items.length === 0) {
            throw new Exception("Order must contain at least one product");
        }

        for (const item of payload.items) {
            const product = await getProductById(item.productId);
            if (!product) {
                throw new ResourceNotFoundException(`Product with ID ${item.productId} not found`);
            }
        }
        const orders = ensureArray(payload)

        const order = await Order.findOne({ user: userId });
        if (order) {
            order.orders.push(...orders);
            await order.save();
        } else {
            const new_order = await createOrder({ user: userId, orders: orders });
            if (!new_order) {
                throw new Exception("Unable to create order");
            }
        }

        // Delete the cart after creating the order
        const cart = await Cart.findOne({ user: userId });
        if (cart) {
            cart.items = cart.items.filter(item =>
                !payload.items.some(orderItem =>
                    orderItem.productId.toString() === item.productId.toString() &&
                    orderItem.size === item.size &&
                    orderItem.color === item.color
                )
            );
            await cart.save();
        }
    }

    // Get an order by ID
    public async getOrderByIdFunction(orderId: string) {
        const order = await Order.findById(orderId).populate("user", "name email").populate("items.productId");
        if (!order) {
            throw new ResourceNotFoundException("Order not found");
        }
        return { order };
    }


    // Get a user's orders
    public async getAUserOrdersFunction(userId: string) {

        let userOrders = await Order.findOne({ user: userId }).populate({
            path: "orders.items.productId",
            select: "title price images", // adjust fields based on your Product model
        });

        // if the user doesn't have any orders, create an empty order
        if (!userOrders) {
            userOrders = await Order.create({ user: userId, orders: [] })
        }
        // const order = await Order.findOne({ user: userId }).populate("order.items.productId");
        if (!userOrders) {
            throw new ResourceNotFoundException("No orders found on thi account");
        }
        return { userOrders };
    }

    // Delete an order
    public async deleteOrderFunction(orderId: string) {
        const order = await Order.findByIdAndDelete(orderId);
        if (!order) {
            throw new ResourceNotFoundException("Order not found");
        }
        return { order };
    }

    // Get all orders
    public async getAllOrdersFunction() {
        const orders = await Order.find().populate("user", "name email").populate("order.items.productId");
        return orders;
    }
}

export const OrderService = new OrderServiceClass();
