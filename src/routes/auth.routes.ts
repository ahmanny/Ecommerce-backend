import { Router } from 'express';
import * as controller from '../controllers/user.controller';
import { UserMiddleware } from '../middlewares';
import { upload } from '../middlewares/upload.middleware';

export const auth = Router();
const userMiddleware = new UserMiddleware();

auth.post('/login', controller.loginController())
auth.post('/login/veryfyOtp', controller.validateOtpController())
auth.post('/check-registration-token', controller.checkRegistration())
auth.post(
    '/complete-registration', upload.single('profilePicture'),
    controller.completeRegistrationController()
);