import {Request, Response} from "express";
import AuthService from "../services/AuthService";
import {IResponse} from "../types";
import {IUser} from "../models/User";
import {IAuthResponse} from "../types/jwt";

interface ILoginRequest {
    email: string;
    password: string;
}

interface IRegisterRequest extends Omit<IUser, 'userId' | 'createdAt' | 'comparePassword'> {
}

class AuthController {

    async register(
        req: Request<{}, {}, IRegisterRequest>,
        res: Response<IResponse<IAuthResponse>>
    ) {
        try {
            const userData = req.body;
            if (!userData.email || !userData.password || !userData.name) {
                res.status(400).json({
                    error: 'Missing required fields',
                    data: null
                });
                return;

            }
            const authData = await AuthService.register(userData);
            res.cookie('refreshToken', authData.refreshToken, {
                httpOnly: true,
                maxAge: 24 * 60 * 60 * 1000 * 7,
                sameSite: 'strict'
            });

            res.status(201).json({
                data: {accessToken: authData.accessToken},
                error: null
            });
        } catch (error) {
            res.status(500).json({
                error: error instanceof Error ? error.message : 'Registration failed',
                data: null
            });
        }
    }

    async login(
        req: Request<{}, {}, ILoginRequest>,
        res: Response<IResponse<IAuthResponse>>
    ) {
        try {
            const {email, password} = req.body;
            if (!email || !password) {
                res.status(400).json({
                    error: 'Email and password are required',
                    data: null
                });
                return
            }
            const authData = await AuthService.login(email, password);

            res.cookie('refreshToken', authData.refreshToken, {
                httpOnly: true,
                maxAge: 7 * 24 * 60 * 60 * 1000,
                sameSite: 'strict'
            });
            res.status(200).json({
                data: {accessToken: authData.accessToken},
                error: null
            });
        } catch (error) {
            res.status(401).json({
                error: error instanceof Error ? error.message : 'Authentication failed',
                data: null
            });
        }
    }


    async refreshTokens(req: Request, res: Response<IResponse<IAuthResponse>>) {
        try {
            const refreshToken = req.cookies.refreshToken;
            if (!refreshToken) {
                res.status(401).json({
                    error: 'Refresh token not provided',
                    data: null
                });
                return
            }
            const authData = await AuthService.refreshTokens(refreshToken);

            res.cookie('refreshToken', authData.refreshToken, {
                httpOnly: true,
                maxAge: 7 * 24 * 60 * 60 * 1000,
                sameSite: 'strict'
            });

            res.status(200).json({
                data: {accessToken: authData.accessToken},
                error: null
            });
        } catch (error) {
            res.status(401).json({
                error: error instanceof Error ? error.message : 'Token refresh failed',
                data: null
            });
        }
    }


    async logout(req: Request, res: Response<IResponse<boolean>>) {
        try {
            const refreshToken = req.cookies.refreshToken;

            if (refreshToken) {
                const payload = AuthService.verifyRefreshToken(refreshToken);

                await AuthService.revokeRefreshToken(payload.userId);
            }

            res.clearCookie('refreshToken');

            res.status(200).json({
                data: true,
                error: null
            });
        } catch (error) {
            res.status(500).json({
                error: error instanceof Error ? error.message : 'Logout failed',
                data: false
            });
        }
    }
}

export default new AuthController();