import { Router } from 'express';
import * as controller from '../controllers/wishlist.controller';
import { UserMiddleware } from '../middlewares';

export const wishlist = Router();
const userMiddleware = new UserMiddleware();


wishlist.post('/toggle', controller.toggleWishlist())
wishlist.get('/get', controller.getUserWishlist())
wishlist.delete('/delete/:id', controller.deleteUserWishlist())
