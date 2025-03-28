import mongoose from "mongoose";
import {randomUUID} from "node:crypto";
import bcrypt from 'bcrypt';

export interface IUser {
    userId: string;
    name: string;
    email: string;
    password: string;
    role: 'user' | 'admin';
    refreshToken?: string;
    isAdmin?: boolean;
    createdAt: string;

    comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new mongoose.Schema<IUser>({
    userId: {type: String, required: true, unique: true, default: randomUUID},
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    role: {type: String, enum: ['user', 'admin'], default: 'user'},
    refreshToken: {type: String, default: null},
    createdAt: {type: String}
});
userSchema.pre('save', async function (next) {
    const user = this;

    if (!user.isModified('password')) return next();

    try {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
        next();
    } catch (error) {
        return next(error as Error);
    }
});

userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
    try {
        return await bcrypt.compare(candidatePassword, this.password);
    } catch (error) {
        throw error;
    }
};
export default mongoose.model("User", userSchema);
