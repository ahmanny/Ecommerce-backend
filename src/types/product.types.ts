


export interface AddNewProductPayloadInterface {
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
}