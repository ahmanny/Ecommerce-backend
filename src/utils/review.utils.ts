
import mongoose from 'mongoose';
import { Review } from '../models/review.models';
import { Product } from '../models/product.model';

export const recalculateAverageRating = async (productId: string) => {
    // Find all review documents that reference this product
    const productReviews = await Review.find({ product: productId });

    const averageRating = productReviews.length
        ? productReviews.reduce((sum, r) => sum + r.rating, 0) / productReviews.length
        : 0;

    await Product.findByIdAndUpdate(productId, {
        averageRating,
        reviewCount: productReviews.length,
    });

};
