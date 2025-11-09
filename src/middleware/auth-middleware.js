import jwt from "jsonwebtoken";
import { responseError } from "../error/response-error.js";
import { prismaClient } from "../application/database.js";

export const authMiddleware = async (req, res, next) => {
  const authorization = req.headers.authorization;

  if (!authorization) {
    return res.status(403).json({
      status: 403,
      data: null,
    });
  }

  const [prefix, token] = authorization.split(" ");

  if (!(prefix === "Bearer" && token)) {
    return res.status(403).json({
      status: 403,
      data: null,
    });
  }

  const tokenDecrypt = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  if (!tokenDecrypt) {
    return res.status(403).json({
      status: 403,
      data: null,
    });
  }

  const user = await prismaClient.user.findFirst({
    where: {
      id: tokenDecrypt.id,
    },
  });

  req.user = user;
  next();
};
