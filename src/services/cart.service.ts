import { Types } from "mongoose";
import Exception from "../exceptions/Exception";
import { Cart } from "../models/cart.model";
import { CartInterfacePayload, deleteCartPayloadInterface, GetCartInterfacePayload } from "../types/cart.types";
import { mergeCartItems } from "../utils/cart.utils";
import ResourceNotFoundException from "../exceptions/ResourceNotFoundException";







class CartServiceClass {
    constructor() {
        // super()
    }

    public async syncCartFunction(payload: CartInterfacePayload) {
        if (!payload.items || payload.items.length === 0) {
            throw new Exception("Cart must contain an item");
        }
        let cart = await Cart.findOne({ user: payload.user });


        if (cart) {
            const mergedItems = mergeCartItems(cart.items, payload.items);
            cart.items = mergedItems;
            await cart.save();
        } else {
            cart = await Cart.create({ user: payload.user, items: payload.items });
        }
    }

    // get user carts
    public async getUserCartsFunction(payload: GetCartInterfacePayload) {
        const cart = await Cart.findOne({ user: payload.userId }).populate("items.productId", "images price title");
        return {
            cart
        }
    }
    // delete a cart function
    public async deleteCartFunction(payload: deleteCartPayloadInterface) {
        const cart = await Cart.findOne({ user: payload.userId })
        if (!cart) {
            throw new ResourceNotFoundException("Cart not found")
        }
        const [productId, color, size] = payload.deleteId.split("-");
        cart.items = cart.items.filter((item) => !(
            item.productId.equals(productId) &&
            item.color === color && 
            item.size === size
        )
        )
        // Save the updated cart
        await cart.save();
    }


}

export const CartService = new CartServiceClass();
