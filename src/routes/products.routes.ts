import { Router } from 'express';
import * as controller from '../controllers/products.controller';
import { UserMiddleware } from '../middlewares';
import { upload } from '../middlewares/upload.middleware';
import { ProductMiddleware } from '../middlewares/product.middleware';
import { uploadToCloudinary } from '../middlewares/uploadToCloudinary.middleware';

export const product = Router();
const userMiddleware = new UserMiddleware();
const productMiddleware = new ProductMiddleware()

product.get('/all-products', controller.getAllProducts())
product.get('/:id', controller.getAProduct())


// need to have an account before you can acces this 
product.use(userMiddleware.validateToken)
product.post('/create', userMiddleware.hasRole("admin"), upload.array('images', 5), productMiddleware.checkIfProductExist, uploadToCloudinary, controller.createNewProduct())
product.put('/:id/update', userMiddleware.hasRole('admin'), controller.updateAProduct())
product.delete('/:id', userMiddleware.hasRole('admin'), controller.deleteProduct())




// product.post(
//     '/password-reset', ,
// userMiddleware.hasRole("admin"),
//     controller.completeRegistrationController()
// );