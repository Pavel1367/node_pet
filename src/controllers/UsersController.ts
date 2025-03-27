import {Request, Response} from "express";
import User, {IUser} from "../models/User";


interface IResponse<T> {
    data: T | null;
    error: unknown | null;
}

class UsersController {
    async create(req: Request<{}, {}, Omit<IUser, "createdAt">>,
                 res: Response<IResponse<IUser>>) {
        const {name, password, email, isAdmin} = req.body;
        try {
            const user = await User.create({
                name, password,
                email,
                createdAt: Date.now(),
                isAdmin: isAdmin ?? false,
            });
            res.status(201).json({data: user, error: null});
        } catch (err) {
            res.status(500).json({error: err, data: null});
        }
    }

    async getAllUsers(req: Request, res: Response<IResponse<Array<IUser>>>) {
        try {
            const users = await User.find()
            res.status(200).json({data: users, error: null});
        } catch (err) {
            res.status(500).json({error: err, data: null});
        }
    }

    async getUser(req: Request<{ userId: string }>, res: Response<IResponse<IUser>>) {
        const {userId} = req.params
        try {
            const user = await User.findOne({userId: userId})
            if (!user) {
                res.status(404).json({data: null, error: 'User not found'});
                return;
            }
            res.status(200).json({data: user, error: null});
        } catch (err) {
            res.status(500).json({error: err, data: null});
        }
    }

    async updateUser(res: Response<IUser[]>) {

    }
}

export default new UsersController();