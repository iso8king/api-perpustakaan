import express from "express"
import userController from "../controller/user-controller.js";

const publicRouter = express.Router();


publicRouter.post('/api/users/register' , userController.register);
publicRouter.post('/api/users/otp' , userController.otpValidation);
publicRouter.post('/api/users/login' , userController.login);
publicRouter.post('/api/users/forgotPasswordRequest' , userController.forgotPasswordCheckEmail);
publicRouter.patch('/api/users/changePassword/:token' , userController.forgotPassword);

export{
    publicRouter
}

