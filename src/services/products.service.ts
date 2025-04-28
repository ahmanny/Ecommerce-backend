import cloudinary from "../configs/cloudinary.config";
import NotFoundException from "../exceptions/NotFoundException";
import UserExistException from "../exceptions/UserNotFoundException";
import { createProduct, getProductByTitle, Product } from "../models/product.model";
import { AddNewProductPayloadInterface, updateProductPayloadInterface } from "../types/product.types";
import { ensureArray } from "../utils/cart.utils";
import { CategoryService } from "./category.service";






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
        const categoryArray = ensureArray(payload.categories)
        const highlightsArray = ensureArray(payload.highlights)
        const categories = await CategoryService.getOrCreateCategoriesFunction(categoryArray)
        const new_Product = await createProduct({ ...payload, price, quantity_available, images: images, highlights: highlightsArray || [], categories: categories || ["shoe"] })
        return {
            new_Product
        }
    }



    public async updateProductFunction(payload: updateProductPayloadInterface) {
        const { productId, product, newImageUrls, existingProductImages } = payload;

        // Ensure updated categories are handled properly
        const categoryArray = ensureArray(product.categories);
        const highlightsArray = ensureArray(product.highlights)
        const reviewsArray = ensureArray(product.reviews)
        const categories = await CategoryService.getOrCreateCategoriesFunction(categoryArray);

        // Determine images to keep and remove
        const keptImages = product.images;
        const removedImages = existingProductImages.filter((img) => !keptImages.includes(img));

        // Delete removed images from Cloudinary
        await Promise.all(
            removedImages.map(async (imgUrl) => {
                const publicId = imgUrl.split("/").pop()?.split(".")[0]; // Extract public ID
                if (publicId) {
                    await cloudinary.uploader.destroy(`product_images/${publicId}`);
                }
            })
        );
        // Update product in DB
        const updatedProduct = await Product.findByIdAndUpdate(
            productId,
            { $set: { ...product, categories: categories || [], highlights: highlightsArray || [], reviews: reviewsArray || [] } },
            { new: true }
        );

        return updatedProduct;
    }



    // get a product using the id
    public async getProductByIdFunction(productId: string) {
        const productQuery = Product.findById(productId).populate("categories");


        const product = await productQuery.exec();

        if (!product) {
            throw new NotFoundException("Product not found");
        }
        return {
            product
        };
    }



    public async getSimilarProductsFunction(productId: string) {
        const currentProduct = await Product.findById(productId).populate('categories');
        if (!currentProduct) {
            throw new NotFoundException("Product not found");
        }

        const categoryIds = currentProduct.categories.map((cat) => cat._id);

        // Try finding similar products in same categories, sorted by averageRating & reviewCount
        let similarProducts = await Product.find({
            _id: { $ne: productId }, // Exclude the current product
            categories: { $in: categoryIds },
        })
            .sort({ averageRating: -1, reviewCount: -1 }) // Highest rated and reviewed first
            .limit(8)
            .populate('categories');

        // If none found, fallback to top selling products (bestsellers)
        if (similarProducts.length === 0) {
            similarProducts = await Product.find({})
                .sort({ totalSold: -1 }) // Bestsellers fallback
                .limit(4)
                .populate('categories');
        }

        return { similarProducts };
    }



    // delete an Product
    public async deleteProductFunction(ProductId: string) {

        // Find product first
        const product = await Product.findById(ProductId);
        if (!product) {
            throw new NotFoundException("Product not found");
        }

        // Delete images from Cloudinary
        // Check if images exist before trying to delete them
        if (product.images?.length > 0) {
            // Delete images from Cloudinary
            await Promise.all(
                product.images.map(async (imgUrl) => {
                    const publicId = imgUrl.split("/").pop()?.split(".")[0]; // Extract public ID
                    if (publicId) {
                        try {
                            await cloudinary.uploader.destroy(`product_images/${publicId}`);
                        } catch (err) {
                            console.error(`Failed to delete image ${publicId}:`, err);
                        }
                    }
                })
            );
        }

        // Delete product from database
        await Product.findByIdAndDelete(ProductId);

        return { message: "Product and images deleted successfully" };

    }


    // get home page product
    public async getHomeProductsFunction() {
        // get most sold products in the DB
        const bestSelling = await Product.find().sort({ totalSold: -1 }).limit(4)
        // get the lates products in the db
        const latest = await Product.find().sort({ createdAt: -1 }).limit(4);

        const featured = await Product.find({
            $or: [
                { totalSold: { $gt: 5 } },
                { averageRating: { $gte: 2.5 }, reviewCount: { $gte: 5 } }
            ]
        }).sort({ totalSold: -1, averageRating: -1 }).limit(4);

        return { featured, bestSelling, latest }

    }
}

export const ProductService = new ProductServiceClass();