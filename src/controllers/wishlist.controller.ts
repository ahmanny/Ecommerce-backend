import { Request, RequestHandler, Response } from "express";
import InvalidAccessCredentialsExceptions from "../exceptions/InvalidAccessCredentialsException";
import { created_handler, error_handler, ok_handler } from "../utils/response_handler";
import { WishlistService } from "../services/wishlist.service";

// add to wishist
export const toggleWishlist = (): RequestHandler => {
    return async (req: Request, res: Response): Promise<void> => {
        try {
            if (!req.user) {
                throw new InvalidAccessCredentialsExceptions("Unauthorized")
            }
            const productId = req.body.productId
            const { action, wishlist } = await WishlistService.toggleWishlistFunction({ productId: productId, user: req.user._id })
            const message =
                action === "added"
                    ? "Item successfully added to wishlist"
                    : "Item successfully removed from wishlist";
            ok_handler(res, message, wishlist);
        } catch (error) {
            console.log(error);
            error_handler(error, req, res)
        }
    }
}

// get all wishlist
export const getUserWishlist = (): RequestHandler => {
    return async (req: Request, res: Response): Promise<void> => {
        try {
            if (!req.user) {
                throw new InvalidAccessCredentialsExceptions("Unauthorized")
            }
            const data = await WishlistService.getUserWishlistFunction({ userId: req.user._id })
            ok_handler(res, "Wishlist is avalaible", data)
        } catch (error) {
            error_handler(error, req, res)

        }
    }
}


export const deleteUserWishlist = (): RequestHandler => {
    return async (req: Request, res: Response): Promise<void> => {
        try {
            if (!req.user) {
                throw new InvalidAccessCredentialsExceptions("Unauthorized")
            }
            const deleteId = req.params.id
            if (!deleteId) {
                throw new InvalidAccessCredentialsExceptions("Invalid id")
            }
            await WishlistService.deleteWishlistFunction({ user: req.user._id, productId: deleteId })
            ok_handler(res, "Wishlist deleted successfully")
        } catch (error) {
            error_handler(error, req, res)
        }
    }
}