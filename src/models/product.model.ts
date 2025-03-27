import { Schema, Types, model } from 'mongoose';

interface IProduct {
    title: string;
    price: number;
    category: string;
    slug: string;
    sku: string;
    stock_status: string;
    quantity_available: number;
    colors: string[];
    sizes: string[];
    description: string;
    images: string[];
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
    category: {
        type: String,
        required: true,
    },
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
    description: {
        type: String,
        required: true,
    },
    images: {
        type: [String],
        required: true,
    },
});

export const Product = model<IProduct>('Product', ProductSchema);


//methods
export const getProducts = () => Product.find();
export const getProductByTitle = (title: String) => Product.findOne({ title });
export const getProductById = (id: Types.ObjectId) => Product.findById(id).lean();
export const createProduct = (values: Record<string, any>) => new Product(values).save().then((Product) => Product.toObject());
export const deleteProductById = (id: string) => Product.findByIdAndDelete({ _id: id });
export const updateProductById = (id: string, values: Record<string, any>) => Product.findByIdAndUpdate(id, values)