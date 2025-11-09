import express from "express"
import { authMiddleware } from "../middleware/auth-middleware.js";
import userController from "../controller/user-controller.js";


const userRouter = express.Router();
userRouter.use(authMiddleware);

userRouter.delete('/api/users/logout' , userController.logout);

userRouter.get('/api/users/current' , userController.get);
userRouter.patch('/api/users/update' , userController.updateProfile)

export {
    userRouter
}