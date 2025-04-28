import mongoose from 'mongoose';
import { Schema, Types, model } from 'mongoose';

interface IProduct {
    title: string;
    price: number;
    categories: Types.ObjectId[]; // Assuming category is a reference to another model
    slug: string;
    sku: string;
    stock_status: string;
    quantity_available: number;
    colors: string[];
    sizes: string[];
    description: string;
    images: string[];
    gender: "male" | "female" | "unisex"
    material: string
    reviews: Types.ObjectId[]
    highlights: string[];
    totalSold: number
    averageRating: number
    reviewCount:number
}

const ProductSchema = new Schema<IProduct>({
    title: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    categories: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true,
    }],
    slug: {
        type: String,
        required: true,
    },
    sku: {
        type: String,
        required: true,
    },
    stock_status: {
        type: String,
        required: true,
    },
    quantity_available: {
        type: Number,
        required: true,
    },
    colors: {
        type: [String],
        required: true,
    },
    sizes: {
        type: [String],
        required: true,
    },
    highlights: {
        type: [String],
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    images: {
        type: [String],
        required: true,
    },
    gender: {
        type: String,
        enum: ["male", "female", "unisex"],
        default: "unisex"
    },
    material: {
        type: String,
        required: true
    },
    totalSold: {
        type: Number,
        default: 0
    },
    averageRating: {
        type: Number,
        default: 0,
    },
    reviewCount: {
        type: Number,
        default: 0,
    },
    reviews: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review'
    }],

});

export const Product = model<IProduct>('Product', ProductSchema);


//methods
export const getProducts = () => Product.find().populate('categories').lean();
export const getProductByTitle = (title: String) => Product.findOne({ title });
export const getProductById = (id: Types.ObjectId) => Product.findById(id).lean();
export const createProduct = (values: Record<string, any>) => new Product(values).save().then((Product) => Product.toObject());
export const deleteProductById = (id: string) => Product.findByIdAndDelete({ _id: id });
export const updateProductById = (id: string, values: Record<string, any>) => Product.findByIdAndUpdate(id, values)