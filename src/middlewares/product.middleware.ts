import type { Request, Response, NextFunction } from 'express';
import { getTokenInfo } from '../utils';
import type { TUser } from '../types';
import { canUserCreateRole, UserRoles } from '../models/user.model';
import Exception from '../exceptions/Exception';
import { error_handler } from '../utils/response_handler';
import InvalidAccessCredentialsExceptions from '../exceptions/InvalidAccessCredentialsException';
import { getProductByTitle, Product } from '../models/product.model';
import { Message } from 'node-mailjet';
import multer from 'multer';






export class ProductMiddleware {
    constructor() { }



    // middleware to check if a product  exists

    async checkIfProductExist(req: Request, res: Response, next: NextFunction) {
        try {
            const { title } = req.body;
            const productId = req.params.id;

            if (productId) {
                // Find the product by ID
                const existingProduct = await Product.findById(productId);
                if (!existingProduct) {
                    throw new Exception("Product not found");
                }
                // If the title is being updated, check if it's already taken
                if (title && title !== existingProduct.title) {
                    const productByName = await Product.findOne({ title });
                    if (productByName) {
                        throw new Exception("Product with this title already exists");
                    }
                }

                req.product = existingProduct; // Attach product to request
            } else {
                // If creating a new product, check for duplicate title
                if (title) {
                    const productByName = await Product.findOne({ title });
                    if (productByName) {
                        throw new Exception("Product with this title already exists");
                    }
                }
            }

            next();
        } catch (error) {
            error_handler(error, req, res);
        }
    }

}




































