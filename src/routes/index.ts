import { Router, Request, Response } from 'express';
import { user } from './user.route';
import { auth } from './auth.routes';
import { UserMiddleware } from '../middlewares';
import { order } from './order.routes';
import { product } from './products.routes';
import { cart } from './carts.routes';
import { wishlist } from './wishlist.routes';
import { category } from './categories.routes';
import { review } from './review.routes';

const routes = Router();
const userMiddleware = new UserMiddleware();

// Home route
routes.get('/', (req: Request, res: Response) => {
    res.send('Welcome to the API project!');
});

// API routes
// authentication not required
routes.use('/authentication', auth);
routes.use('/user', user);
routes.use('/products', product);
routes.use('/categories', category)
routes.use('/review', review)

// authentication required
routes.use(userMiddleware.validateToken)
routes.use('/order', order);
routes.use('/cart', cart)
routes.use('/wishlist', wishlist)


export default routes;
