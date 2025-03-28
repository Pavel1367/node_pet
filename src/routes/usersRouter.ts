import express from 'express';
import {authenticate, checkRole} from "../middlewares/Auth.middleware";
import UsersController from "../controllers/UsersController";

export const usersRouter = express.Router();
usersRouter.post('/', authenticate, checkRole(['admin']), UsersController.create);
usersRouter.get('/:userId', authenticate, UsersController.getUser);
usersRouter.get('/', authenticate, checkRole(['admin']), UsersController.getAllUsers);
usersRouter.put('/:userId', authenticate, UsersController.updateUser);
usersRouter.delete('/:userId', authenticate, checkRole(['admin']), UsersController.deleteUser);