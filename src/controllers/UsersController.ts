import {Request, Response} from "express";
import User, {IUser} from "../models/User";
import UserService from "../services/UserService";
import {IResponse} from "../types";


class UsersController {
    async create(req: Request<{}, {}, Omit<IUser, "createdAt">>,
                 res: Response<IResponse<IUser>>) {
        try {
            const user = await UserService.create(req.body);
            res.status(201).json({data: user, error: null});
        } catch (err) {
            res.status(500).json({error: err, data: null});
        }
    }

    async getAllUsers(req: Request, res: Response<IResponse<Array<IUser>>>) {
        try {
            const users = await UserService.getAllUsers()
            console.log(users);
            res.status(200).json({data: users, error: null});
        } catch (err) {
            res.status(500).json({error: err, data: null});
        }
    }

    async getUser(req: Request<{ userId: string }>, res: Response<IResponse<IUser>>) {
        const {userId} = req.params
        try {
            const user = await UserService.getUser(userId);
            if (!user) {
                res.status(404).json({data: null, error: 'User not found'});
                return;
            }
            res.status(200).json({data: user, error: null});
        } catch (err) {
            res.status(500).json({error: err, data: null});
        }
    }

    async updateUser(req: Request<{ userId: string }, {}, Omit<IUser, 'userId'>>, res: Response<IResponse<IUser>>) {
        try {
            const updatedUser = await UserService.updateUser(req.params.userId, req.body);
            if (!updatedUser) {
                res.status(404).json({data: null, error: 'User update failed'});
            }
            res.status(200).json({data: updatedUser, error: null});
        } catch (err) {
            res.status(500).json({error: err, data: null});

        }
    }

    async deleteUser(req: Request<{ userId: string }>, res: Response<IResponse<boolean>>) {
        try {
            const result = await UserService.deleteUser(req.params.userId);
            res.status(200).json({data: result.acknowledged, error: null});
        } catch (err) {
            res.status(500).json({error: err, data: null});

        }
    }
}

export default new UsersController();