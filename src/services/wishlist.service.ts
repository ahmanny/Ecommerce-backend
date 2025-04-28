import mongoose, { Types } from "mongoose";
import Exception from "../exceptions/Exception";
import NotFoundException from "../exceptions/NotFoundException";
import { Wishlist } from "../models/wishlist.model";
import { WishlistInterfacePayload } from "../types/wishlist.types";







class WishlistServiceClass {
    constructor() {
        // super()
    }
    // Togglle wishlist function
    public async toggleWishlistFunction(payload: WishlistInterfacePayload) {
        if (!payload.productId) {
            throw new Exception("Wishlist must contain a product");
        }

        const productObjectId = new mongoose.Types.ObjectId(payload.productId);
        const userObjectId = new mongoose.Types.ObjectId(payload.user);

        let wishlist = await Wishlist.findOne({ user: userObjectId });

        if (wishlist) {
            const existingItemIndex = wishlist.items.findIndex(
                item => item.productId.equals(productObjectId)
            );

            if (existingItemIndex !== -1) {
                wishlist.items.splice(existingItemIndex, 1); // remove
                await wishlist.save();
                return { action: "removed", wishlist };
            } else {
                wishlist.items.push({ productId: productObjectId, addedAt: new Date(Date.now()), }); // add
                await wishlist.save();
                return { action: "added", wishlist };
            }
        } else {
            wishlist = await Wishlist.create({
                user: userObjectId,
                items: [{ productId: productObjectId }],
            });
            return { action: "added", wishlist };
        }
    }

    // get wishlist of a user function
    public async getUserWishlistFunction(payload: { userId: string }) {
        const userObjectId = new mongoose.Types.ObjectId(payload.userId);
        let wishlist = await Wishlist.findOne({ user: userObjectId }).populate("items.productId");
        // if wishlist is not found, create a new wishlist for the user
        if (!wishlist) {
            wishlist = await Wishlist.create({
                user: userObjectId,
                items: [],
            });
        }
        return {
            wishlist
        }
    }
    // delete a wishlist function
    public async deleteWishlistFunction(payload: WishlistInterfacePayload) {
        const wishlist = await Wishlist.findOne({ user: payload.user })
        if (!wishlist) {
            throw new NotFoundException("Wishlist not found")
        }
        const productId = payload.productId;
        wishlist.items = wishlist.items.filter((item) => !item.productId.equals(productId))
        // Save the updated wishlist
        await wishlist.save();
    }
}

export const WishlistService = new WishlistServiceClass();
