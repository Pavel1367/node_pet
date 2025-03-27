import mongoose from "mongoose";
import {randomUUID} from "node:crypto";

export interface IUser {
    userId: string;
    name: string;
    email: string;
    password: string;
    isAdmin?: boolean;
    createdAt: Date;
}

const userSchema = new mongoose.Schema<IUser>({
    userId: {type: String, required: true, unique: true, default: randomUUID},
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    isAdmin: {type: Boolean, required: false, default: false},
    createdAt: {type: Date, default: Date.now},
});

export default mongoose.model("User", userSchema);
