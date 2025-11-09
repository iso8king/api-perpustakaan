import express from "express";
import { authMiddleware } from "../middleware/auth-middleware.js";
import userController from "../controller/user-controller.js";

const userRouter = express.Router();

userRouter.delete("/api/users/logout", [authMiddleware], userController.logout);
userRouter.get("/api/users/current", [authMiddleware], userController.get);
userRouter.patch("/api/users/update", [authMiddleware], userController.updateProfile);

export { userRouter };
