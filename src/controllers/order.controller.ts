import { Request, RequestHandler, Response } from "express";
import InvalidAccessCredentialsExceptions from "../exceptions/InvalidAccessCredentialsException";
import { OrderService } from "../services/orderProducts.service";
import { created_handler, error_handler, ok_handler } from "../utils/response_handler";
import { getOrderById, getOrders, Order } from "../models/orders.model";
import NotFoundException from "../exceptions/NotFoundException";



// create new order
export const createNewOrder = (): RequestHandler => {
    return async (req: Request, res: Response): Promise<void> => {
        try {
            if (!req.user) {
                throw new InvalidAccessCredentialsExceptions("Unauthorized")
            }
            const data = await OrderService.createNewOrderFunction(req.body, req.user._id)
            created_handler(res, "account successfully creatd", data)
        } catch (error) {
            error_handler(error, req, res)

        }
    }
}
// get all orders
export const getAllOrders = (): RequestHandler => {
    return async (req: Request, res: Response): Promise<void> => {
        try {
            const data = await getOrders()
            ok_handler(res, "Deleted successfully", data)
        } catch (error) {
            error_handler(error, req, res)

        }
    }
}
// get an order
export const getAnOrder = (): RequestHandler => {
    return async (req: Request, res: Response): Promise<void> => {
        try {
            const orderId = req.params.id
            await OrderService.getOrderByIdFunction(orderId)
            ok_handler(res, "Deleted successfully")
        } catch (error) {
            error_handler(error, req, res)

        }
    }
}
// update an order
export const updateOrder = (): RequestHandler => {
    return async (req: Request, res: Response): Promise<void> => {
        try {
            const data = req.body
            const order = await Order.findById(req.params.id)
            if (!order) {
                throw new NotFoundException("Order not found")
            }
            await Order.findByIdAndUpdate(req.params.id, { ...data }, { new: true })

            ok_handler(res, "successfully updated")
        } catch (error) {
            error_handler(error, req, res)

        }
    }
}

// delete order controller
export const deleteOrder = (): RequestHandler => {
    return async (req: Request, res: Response): Promise<void> => {
        try {
            await OrderService.deleteOrderFunction(req.params.id)
            ok_handler(res, "deleted successfully")

        } catch (error) {
            error_handler(error, req, res)

        }
    }
}