import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { publicRouter } from "../routes/public-api.js";
import { adminRouter, userRouter } from "../routes/api.js";
import { errorMiddleware } from "../middleware/error-middleware.js";
import { swaggerUi } from "./swagger.js";
import fs from "fs";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

export const web = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const swaggerPath = path.resolve(__dirname, "../../node_modules/swagger-ui-dist/swagger-ui.css");
const swaggerDocument = JSON.parse(fs.readFileSync(swaggerPath, "utf-8"));

// ✅ CORS aman untuk production (frontend di Vercel)
web.use(
  cors({
    origin: ["https://fe-perpustakaan.vercel.app", "http://localhost:3000"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  }),
);

web.use(express.json());
web.use(cookieParser());

// ✅ Swagger docs
web.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// ✅ Prefix API routes
web.use("/api", publicRouter);
web.use("/api", userRouter);
web.use("/api", adminRouter);

// ✅ Error middleware (with logging)
web.use(errorMiddleware);
