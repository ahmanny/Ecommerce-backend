import type { Request, Response, NextFunction } from 'express';
import Exception from '../exceptions/Exception';
import { error_handler } from '../utils/response_handler';
import { Product } from '../models/product.model';
import ResourceNotFoundException from '../exceptions/ResourceNotFoundException';






export class ProductMiddleware {
    constructor() { }



    // middleware to check if a product  exists

    async checkIfProductExist(req: Request, res: Response, next: NextFunction) {
        try {
            const { slug } = req.body;
            const productId = req.params.id;
            if (productId) {
                // Find the product by ID
                const existingProduct = await Product.findById(productId);
                if (!existingProduct) {
                    throw new ResourceNotFoundException("Product not found");
                }
                req.product = existingProduct; // Attach product to request
            } else {
                // If creating a new product, check for duplicate slug
                if (slug) {
                    const productByName = await Product.findOne({ slug });
                    if (productByName) {
                        throw new Exception("Product with this slug already exists");
                    }
                }
            }

            next();
        } catch (error) {
            error_handler(error, req, res);
        }
    }

}




































