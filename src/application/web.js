import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { publicRouter } from "../routes/public-api.js";
import { errorMiddleware } from "../middleware/error-middleware.js";
import { adminRouter, userRouter } from "../routes/api.js";
import { swaggerUi } from "./swagger.js";
import fs from "fs";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();
export const web = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const swaggerPath = path.join(__dirname, "../docs/swagger.json");
const swaggerDocument = JSON.parse(fs.readFileSync(swaggerPath, "utf-8"));
web.get("/api/docs/swagger.json", (req, res) => {
  res.sendFile(swaggerPath);
});


web.use(
  "/api/docs",
  swaggerUi.serve,
  swaggerUi.setup(undefined, {
    swaggerOptions: {
      url: "/api/docs/swagger.json",
    },
  })
);

web.use(cors());
web.use(express.json());
web.use(cookieParser());
// web.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
web.use(publicRouter);
web.use(userRouter);
web.use(adminRouter);

web.use(errorMiddleware);


