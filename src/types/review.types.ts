import { Types } from "mongoose";

export interface addReviewPaload {
    product: Types.ObjectId,
    rating: number
    comment: string
}