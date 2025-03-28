import {Response, NextFunction} from 'express';
import AuthService from '../services/AuthService';
import UserService from '../services/UserService';
import {IAuthRequest} from '../types/jwt';


export const authenticate = async (req: IAuthRequest, res: Response, next: NextFunction) => {
    try {
        // Получаем токен из заголовка
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            res.status(401).json({
                error: 'Authorization token required',
                data: null
            });
            return;
        }

        const token = authHeader.split(' ')[1];

        const decoded = AuthService.verifyAccessToken(token);
        console.log(decoded);
        const user = await UserService.getUser(decoded.userId);

        if (!user) {
            res.status(401).json({
                error: 'User not found',
                data: null
            });
            return;

        }
        req.user = user;

        next();
    } catch (error) {
        res.status(401).json({
            error: error instanceof Error ? error.message : 'Unauthorized',
            data: null
        });
    }
};

export const checkRole = (roles: string[]) => {
    return (req: IAuthRequest, res: Response, next: NextFunction) => {
        if (!req.user) {
            res.status(401).json({
                error: 'Unauthorized',
                data: null
            });
            return;

        }

        if (!roles.includes(req.user.role)) {
            res.status(403).json({
                error: 'Insufficient permissions',
                data: null
            });
            return;

        }

        next();
    };
};