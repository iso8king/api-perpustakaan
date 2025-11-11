import express from "express";
import userController from "../controller/user-controller.js";

const publicRouter = express.Router();

publicRouter.post("/api/users/register", userController.register);
// publicRouter.post('/api/users/otp' , userController.otpValidation);
publicRouter.post("/api/users/login", userController.login);
publicRouter.post("/api/users/forgotPasswordRequest", userController.forgotPasswordCheckEmail);
publicRouter.patch("/api/users/changePassword", userController.forgotPassword);
// publicRouter.post('/api/users/refreshOtp' , userController.refresh_otp);
publicRouter.post("/api/users/token", userController.token);
publicRouter.post("/api/users/activate", userController.validating_activation);
publicRouter.post("/api/users/refreshCode", userController.refresh_activate);

export { publicRouter };
