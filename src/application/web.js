import express from "express"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import { publicRouter } from "../routes/public-api.js";
import { errorMiddleware } from "../middleware/error-middleware.js";
import { userRouter } from "../routes/api.js";

dotenv.config();
export const web = express();

web.use(express.json());
web.use(cookieParser());
web.use(publicRouter);
web.use(userRouter)

web.use(errorMiddleware)
