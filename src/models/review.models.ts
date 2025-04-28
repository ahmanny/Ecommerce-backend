import mongoose, { Date, Schema, Types, model } from 'mongoose';
interface IUserReview {
    user: Types.ObjectId;
    product: Types.ObjectId;
    rating: number;
    comment: string;
    isVerifiedBuyer: boolean;
}


const UserReviewsSchema = new Schema<IUserReview>({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    product: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
    },
    rating: {
        type: Number,
        required: true,
    },
    comment: {
        type: String,
        required: true,
    },
    isVerifiedBuyer: {
        type: Boolean,
        default: false
    },
}, {
    timestamps: true,
});

export const Review = model<IUserReview>('Review', UserReviewsSchema);

