import express from "express";
import AuthController from "../controllers/AuthController";

export const authRouter = express.Router();

authRouter.post('/register', AuthController.register);
authRouter.post('/login', AuthController.login);
authRouter.post('/refresh', AuthController.refreshTokens);
authRouter.post('/logout', AuthController.logout);

