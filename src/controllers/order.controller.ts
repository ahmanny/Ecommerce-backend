import { Request, RequestHandler, Response } from "express";
import InvalidAccessCredentialsExceptions from "../exceptions/InvalidAccessCredentialsException";
import { OrderService } from "../services/order.service";
import { created_handler, error_handler, ok_handler } from "../utils/response_handler";
import NotFoundException from "../exceptions/NotFoundException";
import { Order } from "../models/orders.model";

// Create new order
export const createNewOrder = (): RequestHandler => {
    return async (req: Request, res: Response): Promise<void> => {
        try {
            if (!req.user) {
                throw new InvalidAccessCredentialsExceptions("Unauthorized");
            }
            await OrderService.createNewOrderFunction(req.body, req.user._id);
            created_handler(res, "Order successfully created"); // Adjusted message
        } catch (error) {
            console.log(error);
            error_handler(error, req, res);
        }
    };
};

// Get all orders
export const getAllOrders = (): RequestHandler => {
    return async (req: Request, res: Response): Promise<void> => {
        try {
            const data = await OrderService.getAllOrdersFunction();
            ok_handler(res, "Fetched orders successfully", data);
        } catch (error) {
            error_handler(error, req, res);
        }
    };
};

// Get a user orders
export const getUserOrders = (): RequestHandler => {
    return async (req: Request, res: Response): Promise<void> => {
        try {
            if (!req.user) {
                throw new InvalidAccessCredentialsExceptions("Unauthorized");
            }
            const userId = req.user._id;
            const data = await OrderService.getAUserOrdersFunction(userId);
            ok_handler(res, "Fetched user orders successfully", data);
        } catch (error) {
            error_handler(error, req, res);
        }
    };
};



// Get an order
export const getAnOrder = (): RequestHandler => {
    return async (req: Request, res: Response): Promise<void> => {
        try {
            const orderId = req.params.id;
            const data = await OrderService.getOrderByIdFunction(orderId);
            ok_handler(res, "Fetched order successfully", data);
        } catch (error) {
            error_handler(error, req, res);
        }
    };
};

// Update an order
export const updateOrder = (): RequestHandler => {
    return async (req: Request, res: Response): Promise<void> => {
        try {
            const data = req.body;
            const order = await Order.findById(req.params.id);
            if (!order) {
                throw new NotFoundException("Order not found");
            }
            await Order.findByIdAndUpdate(req.params.id, { ...data }, { new: true });

            ok_handler(res, "Order successfully updated");
        } catch (error) {
            error_handler(error, req, res);
        }
    };
};

// Delete an order
export const deleteOrder = (): RequestHandler => {
    return async (req: Request, res: Response): Promise<void> => {
        try {
            await OrderService.deleteOrderFunction(req.params.id);
            ok_handler(res, "Order successfully deleted");
        } catch (error) {
            error_handler(error, req, res);
        }
    };
};
