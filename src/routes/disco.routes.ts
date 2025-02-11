import { Router } from 'express';
import * as controller from '../controllers/disco.controller';
import { UserMiddleware } from '../middlewares';

export const disco = Router();
const userMiddleware = new UserMiddleware();




// user.post('/refresh', controller.refresh);
// user.post('/validate', controller.validate);
disco.use(userMiddleware.validateToken, userMiddleware.hasAnyRole(['superadmin', 'admin']))
disco.post('/new-disco', controller.addNewDiscoController());
disco.get('/all-discos', controller.getAllDiscos());
disco.get('/all-discos/:id', controller.getDiscoByIdAndMembers());
