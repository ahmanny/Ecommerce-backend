import { Types } from "mongoose";
import { Category } from "../models/productCategory.model";

class CategoryServiceClass {
    constructor() {
        // super()
    }

    // get user carts
    public async getOrCreateCategoriesFunction(categoryNames: string[] | Types.ObjectId[]) {
        const categoryIds = [];

        for (const name of categoryNames) {
            // Try to find the category
            let category = await Category.findOne({ name });

            if (!category) {
                // If it doesn't exist, create it
                category = await Category.create({ name });
            }

            categoryIds.push(category._id);
        }

        return categoryIds;
    }
}

export const CategoryService = new CategoryServiceClass();
