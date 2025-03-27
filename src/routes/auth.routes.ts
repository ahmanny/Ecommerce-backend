import { Router } from 'express';
import * as controller from '../controllers/auth.controller';
import { UserMiddleware } from '../middlewares';

export const auth = Router();
// const userMiddleware = new UserMiddleware();



auth.post('/login', controller.loginController())
auth.post('/sign-up', controller.signup())
auth.post('/forgotten-password', controller.forgottenPasswordController())
auth.post('/password-reset', controller.passwordResetController());




// auth.post(
//     '/password-reset', upload.single('profilePicture'),
//     controller.completeRegistrationController()
// );