import { Router } from 'express';
import * as controller from '../controllers/categories.controller';

export const category = Router();
category.get('/get', controller.getCategories())
