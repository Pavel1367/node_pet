import mongoose, {Schema} from "mongoose";
import {randomUUID} from "node:crypto";
import bcrypt from 'bcrypt';

export interface IProduct {
    productId: string;
    description: string;
    price: number;
    stock: number;
    categorySlug: string;
    images: string[];
    createdAt: string;
    updatedAt: string;
}


const ProductSchema = new Schema<IProduct>({
    productId: {type: String, required: true, default: () => randomUUID()},
    description: {type: String, required: true},
    price: {type: Number, required: true, min: 0},
    stock: {type: Number, required: true, min: 0},
    categorySlug: {type: String, required: true, ref: 'Category'},
    createdAt: {type: String, default: Date.now().toString()},
    updatedAt: {type: String, default: Date.now().toString()},
});

ProductSchema.pre('save', async function (next) {
    this.updatedAt = Date.now().toString();
    next()
})
export default mongoose.model<IProduct>('Product', ProductSchema);