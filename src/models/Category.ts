import mongoose, {Schema} from "mongoose";
import {randomUUID} from "node:crypto";
import bcrypt from 'bcrypt';

export interface ICategory {
    categoryId: string;
    slug: string;
    createdAt: string;
    updatedAt: string;
}


const CategorySchema = new Schema<ICategory>({
    categoryId: {type: String, required: true, default: () => randomUUID()},
    slug: {type: String, required: true, unique: true, lowercase: true, trim: true},
    createdAt: {type: String, default: Date.now().toString()},
    updatedAt: {type: String, default: Date.now().toString()},
});
CategorySchema.index({slug: 1});
CategorySchema.pre('save', async function (next) {
    this.updatedAt = Date.now().toString();
    next()
})
export default mongoose.model<ICategory>('Category', CategorySchema);