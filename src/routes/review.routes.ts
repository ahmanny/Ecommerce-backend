import { Router } from 'express';
import * as controller from '../controllers/review.controller';
import { UserMiddleware } from '../middlewares';

export const review = Router();
const userMiddleware = new UserMiddleware();

review.get('/all', controller.getAllReviews())
review.get('/product/:id', controller.getProductReviews())

// need user to be authenticated \
review.use(userMiddleware.validateToken)
review.post('/add', controller.addReview())
review.get('/get-user', controller.getUserReviews())
review.get('/get/:id', controller.getReview())
review.delete('/delete/:id', controller.deleteReview())
