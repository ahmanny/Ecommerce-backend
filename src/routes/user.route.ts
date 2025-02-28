import { Router } from 'express';
import * as controller from '../controllers/user.controller';
import { UserMiddleware } from '../middlewares';

export const user = Router();
const userMiddleware = new UserMiddleware();


// user.post('/refresh', controller.refresh);
// user.post('/validate', controller.validate);
// user.post('/add-new-user/:id', controller.addNewUser())
// user.get('/', controller.getUser());