import { Router } from 'express';
import * as controller from '../controllers/order.controller';
import { UserMiddleware } from '../middlewares';

export const order = Router();
const userMiddleware = new UserMiddleware();



order.post('/create', controller.createNewOrder())
order.get('/all-orders', userMiddleware.hasRole('admin'), controller.getAllOrders())
order.get('/:id', controller.getAnOrder())
order.put('/:id/update', controller.updateOrder())
order.delete('/:id', controller.deleteOrder())




// order.post(
//     '/password-reset', upload.single('profilePicture'),
//     controller.completeRegistrationController()
// );