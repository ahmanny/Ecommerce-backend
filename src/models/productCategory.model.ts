import mongoose, { Schema } from "mongoose";

interface Icategory {
    name: string
}

const CategorySchema = new Schema<Icategory>({
    name: { type: String, required: true, unique: true },
});

export const Category = mongoose.model<Icategory>("Category", CategorySchema);
