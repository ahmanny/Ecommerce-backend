import { Router } from 'express';
import * as controller from '../controllers/admin.controller';
import { UserMiddleware } from '../middlewares';

export const admin = Router();
const userMiddleware = new UserMiddleware();



admin.use(userMiddleware.hasRole('admin'))

admin.get('/dashboard-stats', controller.getAdminDashboardStats());