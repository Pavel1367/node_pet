import {Request, Response} from "express";
import User, {IUser} from "../models/User";
import {IResponse} from "../types";

class UserService {
    async create(user: Omit<IUser, "createdAt">) {
        return await User.create({
            ...user, createdAt: Date.now()
        });
    }

    async getAllUsers() {
        return User.find();
    }

    async getUser(id: string) {
        if (!id) {
            throw new Error("id not found");
        }
        return User.findOne({userId: id});
    }

    async updateUser(id: string, user: Omit<IUser, 'userId'>) {
        if (!id) {
            return null
        }
        return User.findOneAndUpdate({userId: id}, user, {new: true})
    }

    async deleteUser(id: string) {
        return User.deleteOne({userId: id})
    }
}

export default new UserService();