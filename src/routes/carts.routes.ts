import { Router } from 'express';
import * as controller from '../controllers/cart.controller';
import { UserMiddleware } from '../middlewares';

export const cart = Router();
const userMiddleware = new UserMiddleware();


cart.post('/sync', controller.syncCart())
cart.post('/add', controller.addToCart())
cart.get('/get', controller.getCarts())
cart.delete('/delete/:id', controller.deleteCart())
