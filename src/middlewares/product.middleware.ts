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



    // middleware to check if a product with the title exists
    async checkIfProductExist(req: Request, res: Response, next: NextFunction) {
        try {
            const { title } = req.body
            const productByName = await Product.findOne({ title })

            if (productByName) {
                console.log("false");
                throw new Exception("Product with this title exists")
                // return res.status(400).json({ message: "" })
            } else {
                next();
            }
        } catch (error) {
            error_handler(error, req, res)
        }
    }
}




































