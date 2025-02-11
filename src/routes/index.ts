import { Router, Request, Response } from 'express';
import { user } from './user.route';
import { auth } from './auth.routes';
import { UserMiddleware } from '../middlewares';
import { disco } from './disco.routes';

const routes = Router();
const userMiddleware = new UserMiddleware();

// Home route
routes.get('/', (req: Request, res: Response) => {
    res.send('Welcome to the API project!');
});

// API routes
// authentication not required
routes.use('/authentication', auth);

routes.use('/disco', disco)

routes.use(userMiddleware.validateToken)
// authentication required
routes.use('/user', user);


export default routes;
