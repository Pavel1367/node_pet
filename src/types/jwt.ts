import {Request} from 'express';
import {IUser} from '../models/User';

export interface ITokenPayload {
    userId: string;
    email: string;
}

export interface IAuthRequest extends Request {
    user?: IUser;
}

export interface IAuthResponse {
    accessToken: string;
    refreshToken?: string;
}

export interface IAuthUser extends Omit<IUser, 'password'> {
    password: string;
}