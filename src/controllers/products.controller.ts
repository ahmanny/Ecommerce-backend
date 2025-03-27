import { Request, RequestHandler, Response } from "express";
import InvalidAccessCredentialsExceptions from "../exceptions/InvalidAccessCredentialsException";
import { created_handler, error_handler, ok_handler } from "../utils/response_handler";
import NotFoundException from "../exceptions/NotFoundException";
import { getProducts, Product } from "../models/product.model";
import { ProductService } from "../services/products.service";
import cloudinary from "../configs/cloudinary.config";
import Exception from "../exceptions/Exception";



// create new products
export const createNewProduct = (): RequestHandler => {
    return async (req: Request, res: Response): Promise<void> => {
        try {
            console.log("controller");

            if(!req.cloudinaryUrls || req.cloudinaryUrls.length===0){
                throw new Exception("image upload failed")
            }
            const imageUrls = req.cloudinaryUrls
            const data = await ProductService.createProductFunction(req.body, imageUrls)
            ok_handler(res, "All products gotten successfully")
        } catch (error) {
            error_handler(error, req, res)
        }
    }
}
// get all products
export const getAllProducts = (): RequestHandler => {
    return async (req: Request, res: Response): Promise<void> => {
        try {
            const data = await getProducts()
            ok_handler(res, "All products gotten successfully", data)
        } catch (error) {
            error_handler(error, req, res)
        }
    }
}
// get a product
export const getAProduct = (): RequestHandler => {
    return async (req: Request, res: Response): Promise<void> => {
        try {
            const productId = req.params.id
            const data = await ProductService.getProductByIdFunction(productId)
            ok_handler(res, "Product gotten successfully", data)
        } catch (error) {
            error_handler(error, req, res)

        }
    }
}
// update an product
export const updateAProduct = (): RequestHandler => {
    return async (req: Request, res: Response): Promise<void> => {
        try {
            const data = req.body
            const order = await Product.findById(req.params.id)
            if (!order) {
                throw new NotFoundException("Order not found")
            }
            await Product.findByIdAndUpdate(req.params.id, { ...data }, { new: true })

            ok_handler(res, "successfully updated")
        } catch (error) {
            error_handler(error, req, res)

        }
    }
}

// delete order controller
export const deleteProduct = (): RequestHandler => {
    return async (req: Request, res: Response): Promise<void> => {
        try {
            await ProductService.deleteProductFunction(req.params.id)
            ok_handler(res, "deleted successfully")

        } catch (error) {
            error_handler(error, req, res)

        }
    }
}