import { Request, RequestHandler, Response } from "express";
import { error_handler, ok_handler } from "../utils/response_handler";
import { CartService } from "../services/cart.service";
import { ensureArray } from "../utils/cart.utils";
import UnauthorizedAccessException from "../exceptions/UnauthorizedAccessException";
import MissingParameterException from "../exceptions/MissingParameterException";

// sync cart
export const syncCart = (): RequestHandler => {
    return async (req: Request, res: Response): Promise<void> => {
        try {
            if (!req.user) {
                throw new UnauthorizedAccessException("Unauthorized")
            }
            await CartService.syncCartFunction({ items: req.body, user: req.user._id })
            ok_handler(res, "Cart successfully synced")
        } catch (error) {
            console.log(error);
            error_handler(error, req, res)
        }
    }
}
// add to cart
export const addToCart = (): RequestHandler => {
    return async (req: Request, res: Response): Promise<void> => {
        try {
            if (!req.user) {
                throw new UnauthorizedAccessException("Unauthorized")
            }
            const items = ensureArray(req.body)
            await CartService.syncCartFunction({ items: items, user: req.user._id })
            ok_handler(res, "Cart successfully added")
        } catch (error) {
            console.log(error);
            error_handler(error, req, res)

        }
    }
}

// get all carts
export const getCarts = (): RequestHandler => {
    return async (req: Request, res: Response): Promise<void> => {
        try {
            if (!req.user) {
                throw new UnauthorizedAccessException("Unauthorized")
            }
            const data = await CartService.getUserCartsFunction({ userId: req.user._id })
            ok_handler(res, "Cart successfully synced", data)
        } catch (error) {
            error_handler(error, req, res)

        }
    }
}


export const deleteCart = (): RequestHandler => {
    return async (req: Request, res: Response): Promise<void> => {
        try {
            if (!req.user) {
                throw new UnauthorizedAccessException("Unauthorized")
            }
            const deleteId = req.params.id
            if (!deleteId) {
                throw new MissingParameterException("Invalid id")
            }
            await CartService.deleteCartFunction({ userId: req.user._id, deleteId: deleteId })
            ok_handler(res, "Cart deleted successfully")
        } catch (error) {
            error_handler(error, req, res)
        }
    }
}