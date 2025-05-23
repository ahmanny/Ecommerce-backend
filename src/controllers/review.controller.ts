import { Request, RequestHandler, Response } from "express";
import { created_handler, error_handler, ok_handler } from "../utils/response_handler";
import { ReviewService } from "../services/review.service";
import UnauthorizedAccessException from "../exceptions/UnauthorizedAccessException";
import MissingParameterException from "../exceptions/MissingParameterException";

// Create new review
export const addReview = (): RequestHandler => {
    return async (req: Request, res: Response): Promise<void> => {
        try {
            if (!req.user) {
                throw new UnauthorizedAccessException("Unauthorized");
            }
            await ReviewService.addReviewFunction(req.body, req.user._id);
            created_handler(res, "Review successfully Added"); // Adjusted message
        } catch (error) {
            console.log(error);
            error_handler(error, req, res);
        }
    };
};





// Get all reviews
export const getAllReviews = (): RequestHandler => {
    return async (req: Request, res: Response): Promise<void> => {
        try {
            const data = await ReviewService.getAllReviews();
            ok_handler(res, "Fetched Reviews successfully", data);
        } catch (error) {
            console.log(error);
            error_handler(error, req, res);
        }
    };
};




// Get a products reviews
export const getProductReviews = (): RequestHandler => {
    return async (req: Request, res: Response): Promise<void> => {
        try {
            const productId = req.params.id;
            if (!productId) {
                throw new MissingParameterException("product Id is missing")
            }
            const { reviews } = await ReviewService.getProductReviews(productId);
            ok_handler(res, "Fetched products reviews successfully", reviews);
        } catch (error) {
            console.log(error);
            error_handler(error, req, res);
        }
    };
};




// Get a users reviews
export const getUserReviews = (): RequestHandler => {
    return async (req: Request, res: Response): Promise<void> => {
        try {
            if (!req.user) {
                throw new UnauthorizedAccessException("Unauthorized");
            }
            const userId = req.user._id;
            const data = await ReviewService.getUserReviews(userId);
            ok_handler(res, "Fetched user Reviews successfully", data);
        } catch (error) {
            console.log(error);
            error_handler(error, req, res);
        }
    };
};





// Get a review
export const getReview = (): RequestHandler => {
    return async (req: Request, res: Response): Promise<void> => {
        try {
            const reviewId = req.params.id;
            if (!reviewId) {
                throw new MissingParameterException("Review Id is missing")
            }
            const data = await ReviewService.getReviewById(reviewId);
            ok_handler(res, "Fetched Reviews successfully", data);
        } catch (error) {
            console.log(error);
            error_handler(error, req, res);
        }
    };
};






// Delete an review
export const deleteReview = (): RequestHandler => {
    return async (req: Request, res: Response): Promise<void> => {
        try {
            const reviewId = req.params.id;
            if (!reviewId) {
                throw new MissingParameterException("Review Id is missing")
            }
            await ReviewService.deleteReviewFunction(reviewId);
            ok_handler(res, "Review successfully deleted");
        } catch (error) {
            console.log(error);
            error_handler(error, req, res);
        }
    };
};
