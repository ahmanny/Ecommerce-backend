import { Request, RequestHandler, Response } from "express"
import { Category } from "../models/productCategory.model"
import { error_handler, ok_handler } from "../utils/response_handler"



// get all carts
export const getCategories = (): RequestHandler => {
    return async (req: Request, res: Response): Promise<void> => {
        try {
            const categories = await Category.find()
            ok_handler(res, "Cartegories available", categories)
        } catch (error) {
            error_handler(error, req, res)

        }
    }
}