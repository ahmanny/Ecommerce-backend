import { Types } from "mongoose";

export interface AddNewProductPayloadInterface {
    title: string;
    price: number;
    categories: string[];
    highlights: string[];
    slug: string;
    sku: string;
    stock_status: string;
    quantity_available: number;
    colors: string[];
    sizes: string[];
    description: string;
}

export interface Productinterface {
    title: string;
    colors: string[]
    highlights: string[];
    description: string
    sku: string;
    price: number;
    quantity_available: number
    sizes: string[]
    stock_status: string;
    slug: string
    categories: Types.ObjectId[];
    reviews: Types.ObjectId[];
    images: any[];
    gender: "male" | "female" | "unisex"
    material: string
}

interface ProductEdit {
    title: string;
    colors: string[]
    highlights: string[];
    description: string
    sku: string;
    price: number;
    quantity_available: number
    sizes: string[]
    stock_status: string;
    slug: string
    categories: Types.ObjectId[];
    images: any[];
    gender: "male" | "female" | "unisex"
    material: string
    reviews: string[]
}

export interface updateProductPayloadInterface {
    productId: string
    product: ProductEdit;
    newImageUrls: string[]
    existingProductImages: string[]
}