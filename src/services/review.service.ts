import Exception from "../exceptions/Exception";
import NotFoundException from "../exceptions/NotFoundException";
import { Order } from "../models/orders.model";
import { getProductById, Product } from "../models/product.model";
import { Review } from "../models/review.models";
import { User } from "../models/user.model";
import { addReviewPaload } from "../types/review.types";
import { recalculateAverageRating } from "../utils/review.utils";

class ReviewServiceClass {
    // Add new Review

    public async addReviewFunction(payload: addReviewPaload, userId: string) {
        if (!payload.product) {
            throw new Exception("You must at least select a product to write a review on.");
        }

        const product = await getProductById(payload.product);
        if (!product) {
            throw new NotFoundException(`Product with ID ${payload.product} was not found`);
        }

        const hasPurchased = await Order.exists({
            user: userId,
            'orders.order_status': 'delivered',
            'orders.items.productId': payload.product
        });

        // Create new review document
        const review = await Review.create({
            user: userId,
            product: payload.product,
            rating: payload.rating,
            comment: payload.comment,
            isVerifiedBuyer: Boolean(hasPurchased),
        });

        if (!review) {
            throw new Exception("Unable to add review");
        }

        // Optional: Add review reference to User (if you want a `reviews` array in User model)
        await User.findByIdAndUpdate(
            userId,
            { $addToSet: { reviews: review._id } },
            { new: true }
        );

        // Optional: Add review reference to Product (if Product schema has `reviews` field)
        await Product.findByIdAndUpdate(
            payload.product,
            { $addToSet: { reviews: review._id } },
            { new: true }
        );

        // Update product averageRating & reviewCount
        await recalculateAverageRating(String(payload.product));
    }

    // get a review by id
    public async getReviewById(reviewId: string) {
        const review = await Review.findById(reviewId)
            .populate('user', 'name email')
            .populate('product', 'name price images');

        if (!review) {
            throw new NotFoundException('Review not found');
        }
        return review;
    }


    // Delete a review
    public async deleteReviewFunction(reviewId: string) {
        const review = await Review.findByIdAndDelete(reviewId);
        if (!review) {
            throw new NotFoundException("Review not found");
        }
        return { review };
    }

    // Get all orders
    public async getAllReviews() {
        const reviews = await Review.find()
            .populate('user', 'name email')         // Add user info
            .populate('product', 'name price images') // Add product info
            .sort({ createdAt: -1 });

        return { reviews };
    }

    // get a products reviews
    public async getProductReviews(productId: string) {
        const product = await Product.findById(productId);
        if (!product) throw new NotFoundException("Product not found");

        const reviews = await Review.find({ product: productId })
            .populate('user', 'name email profilePicture') // user details to be included
            .sort({ createdAt: -1 });

        return { reviews };
    }


    // get a reviews written by a user
    public async getUserReviews(userId: string) {
        const user = await User.findById(userId);
        if (!user) throw new NotFoundException("User not found");

        const reviews = await Review.find({ user: userId })
            .populate('product', 'name price images') // Customize as needed
            .sort({ createdAt: -1 });

        return { reviews };
    }


}

export const ReviewService = new ReviewServiceClass();
