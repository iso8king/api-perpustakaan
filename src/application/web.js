import express from "express"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import { publicRouter } from "../routes/public-api.js";

dotenv.config();
export const web = express();

web.use(express.json());
web.use(cookieParser());
web.use(publicRouter);
