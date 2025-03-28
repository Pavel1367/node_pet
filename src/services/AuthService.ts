import jwt from 'jsonwebtoken';
import User, {IUser} from '../models/User';
import {IAuthResponse, ITokenPayload} from '../types/jwt';
import ms from 'ms';

class AuthService {
    private readonly accessTokenSecret: string;
    private readonly refreshTokenSecret: string;
    private readonly accessTokenExpiry: ms.StringValue;
    private readonly refreshTokenExpiry: ms.StringValue;

    constructor() {
        // Читаем секреты из переменных окружения
        this.accessTokenSecret = process.env.JWT_ACCESS_SECRET || 'access_secret_key';
        this.refreshTokenSecret = process.env.JWT_REFRESH_SECRET || 'refresh_secret_key';
        this.accessTokenExpiry = (process.env.JWT_ACCESS_EXPIRY || '1h') as ms.StringValue;
        this.refreshTokenExpiry = (process.env.JWT_REFRESH_EXPIRY || '7d') as ms.StringValue;
    }

    public async generateTokens(user: IUser): Promise<IAuthResponse> {
        try {
            const payload: ITokenPayload = {
                userId: user.userId,
                email: user.email
            };

            const accessToken = jwt.sign(
                payload,
                this.accessTokenSecret,
                {expiresIn: this.accessTokenExpiry}
            );

            const refreshToken = jwt.sign(
                payload,
                this.refreshTokenSecret,
                {expiresIn: this.refreshTokenExpiry}
            );

            await User.findOneAndUpdate(
                {userId: user.userId},
                {refreshToken},
                {new: true}
            );

            return {accessToken, refreshToken};
        } catch (error) {
            throw new Error(`Error generating tokens: ${error}`);
        }

    }

    public verifyAccessToken(token: string): ITokenPayload {
        try {
            return jwt.verify(token, this.accessTokenSecret) as ITokenPayload;
        } catch (error) {
            throw new Error('Invalid token');
        }
    }

    public verifyRefreshToken(token: string): ITokenPayload {
        try {
            return jwt.verify(token, this.refreshTokenSecret) as ITokenPayload;
        } catch (error) {
            throw new Error('Invalid refresh token');
        }
    }

    public async refreshTokens(refreshToken: string): Promise<IAuthResponse> {
        try {
            const payload = this.verifyRefreshToken(refreshToken);

            const user = await User.findOne({userId: payload.userId, refreshToken});

            if (!user) {
                throw new Error('User not found or token revoked');
            }

            return this.generateTokens(user);
        } catch (error) {
            throw new Error(`Token refresh failed: ${error}`);
        }
    }

    public async revokeRefreshToken(userId: string): Promise<void> {
        try {
            await User.findOneAndUpdate(
                {userId},
                {refreshToken: null}
            );
        } catch (error) {
            throw new Error(`Token revocation failed: ${error}`);
        }
    }

    public async login(email: string, password: string): Promise<IAuthResponse> {
        try {
            const user = await User.findOne({email});

            if (!user) {
                throw new Error('User not found');
            }
            const isPasswordValid = await user.comparePassword(password);
            if (!isPasswordValid) {
                throw new Error('Invalid password');
            }
            return this.generateTokens(user);
        } catch (error) {
            throw new Error(`Authentication failed: ${error}`);
        }
    }

    public async register(userData: Omit<IUser, 'createdAt' | 'userId' | 'comparePassword'>): Promise<IAuthResponse> {
        try {
            const existingUser = await User.findOne({email: userData.email});

            if (existingUser) {
                throw new Error('User with this email already exists');
            }

            const newUser = await User.create({
                ...userData,
                createdAt: Date.now()
            });

            return this.generateTokens(newUser);
        } catch (error) {
            throw new Error(`Registration failed: ${error}`);
        }
    }
}

export default new AuthService();