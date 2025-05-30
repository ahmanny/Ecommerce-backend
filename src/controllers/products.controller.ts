import { Request, RequestHandler, Response } from "express";
import { error_handler, ok_handler } from "../utils/response_handler";
import { getProducts } from "../models/product.model";
import { ProductService } from "../services/products.service";
import Exception from "../exceptions/Exception";
import { parseArray } from "../utils/product.utils";
import MissingParameterException from "../exceptions/MissingParameterException";
import ResourceNotFoundException from "../exceptions/ResourceNotFoundException";



// create new products
export const createNewProduct = (): RequestHandler => {
    return async (req: Request, res: Response): Promise<void> => {
        try {
            if (!req.cloudinaryUrls || req.cloudinaryUrls.length === 0) {
                throw new Exception("image upload failed")
            }
            const imageUrls = req.cloudinaryUrls
            await ProductService.createProductFunction({
                ...req.body, colors: parseArray(req.body.colors), sizes: parseArray(req.body.sizes),
                categories: parseArray(req.body.categories), highlights: parseArray(req.body.highlights)
            }, imageUrls)
            ok_handler(res, "product added successfully")
        } catch (error) {
            error_handler(error, req, res)
        }
    }
}
// update an product
export const updateAProduct = (): RequestHandler => {
    return async (req: Request, res: Response): Promise<void> => {
        try {
            const productId = req.params.id; // Get product ID from URL

            if (!req.product) {
                throw new ResourceNotFoundException("Product not found");
            }
            const newImages = req.cloudinaryUrls || [];
            const existingImages = parseArray(req.body.images);
            const colors = parseArray(req.body.colors);
            const sizes = parseArray(req.body.sizes);
            const categories = parseArray(req.body.categories);
            const highlights = parseArray(req.body.highlights);
            const reviews = parseArray(req.body.reviews);

            // Updated product data
            const updatedProductData = {
                ...req.body,
                images: [...existingImages, ...newImages],
                colors,
                sizes,
                categories,
                highlights,
                reviews,
            };

            // Call service function with productId
            await ProductService.updateProductFunction({
                productId,
                product: updatedProductData,
                newImageUrls: newImages,
                existingProductImages: req.product.images || [],
            });

            ok_handler(res, "Product successfully updated");
        } catch (error) {
            console.log(error);

            error_handler(error, req, res);
        }
    };
};


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
            console.log(error);
            error_handler(error, req, res)

        }
    }
}

// delete Product controller
export const deleteProduct = (): RequestHandler => {
    return async (req: Request, res: Response): Promise<void> => {
        try {
            const productId = req.params.id
            if (!productId) {
                throw new MissingParameterException("product id is required")
            }
            await ProductService.deleteProductFunction(productId)
            ok_handler(res, "deleted successfully")

        } catch (error) {
            console.log(error);
            error_handler(error, req, res)

        }
    }
}


export const getSimilarProduct = (): RequestHandler => {
    return async (req: Request, res: Response): Promise<void> => {
        try {
            const productId = req.params.id; // Get product ID from URL
            if (!productId) {
                throw new MissingParameterException("product id is required")
            }
            const data = await ProductService.getSimilarProductsFunction(productId)
            ok_handler(res, "similar products available", data)
        } catch (error) {
            console.log(error);
            error_handler(error, req, res)
        }
    }
}





export const getHomeProducts = (): RequestHandler => {
    return async (req: Request, res: Response): Promise<void> => {
        try {
            console.log("controller");

            const data = await ProductService.getHomeProductsFunction()
            ok_handler(res, "Home products successfully gotten", data)

        } catch (error) {
            console.log(error);
            error_handler(error, req, res)
        }
    }
}