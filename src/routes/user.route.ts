import { Router } from 'express';
import * as controller from '../controllers/user.controller';
import { UserMiddleware } from '../middlewares';

export const user = Router();
const userMiddleware = new UserMiddleware();



user.use(userMiddleware.validateToken)
// need to have an account before you can acces this 
user.patch('/update', controller.updateUserController());
// user.post('/validate', controller.validate);
// user.post('/add-new-user/:id', controller.addNewUser())
// user.get('/', controller.getUser());