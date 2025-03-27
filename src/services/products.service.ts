import NotFoundException from "../exceptions/NotFoundException";
import UserExistException from "../exceptions/UserExistException";
import { createOrder, Order } from "../models/orders.model";
import { createProduct, getProductByTitle, Product } from "../models/product.model";
import { AddNewProductPayloadInterface } from "../types/product.types";






class ProductServiceClass {
    constructor() {
        // super()
    }

    // add new product
    public async createProductFunction(payload: AddNewProductPayloadInterface, images: string[]) {
        const productByName = await getProductByTitle(payload.title)
        if (productByName) {
            throw new UserExistException("product  already exists")
        }
        const price = Number(payload.price)
        const quantity_available = Number(payload.quantity_available)
        const new_Product = await createProduct({ ...payload, price, quantity_available, images: images })
        return {
            new_Product
        }
    }

    // get a product using the id
    public async getProductByIdFunction(productId: string) {
        const product = await Product.findById(productId)
        if (!product) {
            throw new NotFoundException("Product not found")
        }
        return {
            product
        }
    }

    // delete an order
    public async deleteProductFunction(orderId: string) {
        const order = await Order.findByIdAndDelete(orderId)
        if (!order) {
            throw new NotFoundException("Order not found")
        }
        return { order }
    }
}

export const ProductService = new ProductServiceClass();