import express from "express";
import UsersController from "./controllers/UsersController";


const router = express.Router();

router.post('/users', UsersController.create);
router.get('/users/:userId', UsersController.getUser)
router.get('/users', UsersController.getAllUsers)
// router.put('/users/:userId', UsersController.updateUser)
//
// router.get('/products')
// router.get('/products/:productId')
// router.post('/products')
// router.put('/products/:productId')

export default router;