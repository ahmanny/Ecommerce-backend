import mongoose, { Schema, Types } from "mongoose";

export interface IWishlistItem {
    productId: Types.ObjectId;
    addedAt: Date;
}

interface IWishlist {
    user: Types.ObjectId;
    items: IWishlistItem[];
}

export const WishlistItemChema = new Schema<IWishlistItem>({
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    addedAt: { type: Date, default: Date.now }
});

const WishlistSchema = new Schema<IWishlist>({
    user: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    items: [WishlistItemChema],
});

export const Wishlist = mongoose.model<IWishlist>("Wishlist", WishlistSchema);
