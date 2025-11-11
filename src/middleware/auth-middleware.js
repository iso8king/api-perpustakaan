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
  let tokenDecrypt;

  try {
    tokenDecrypt = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  } catch (error) {
    console.log(error);
    return res.status(403).json({
      status: 403,
      data: {
        jwtError: error.message,
      },
    });
  }

  const user = await prismaClient.user.findFirst({
    where: {
      id: tokenDecrypt.id,
    },
  });

   if (user.status === "not_verified") {
    return res.status(403).json({
      status: 403,
      data: null,
    });
  }

  req.user = user;
  req.user.accessToken = token;
  next();
};


export const roleMiddleware = (roleAllowed = []) => {
    return (req,res,next) => {
        const role = req.user.role;
        if(!roleAllowed.includes(role)){
            res.status(403).json({
            status: 403,
            data: "your role not allowed in here"
         });
        }
        next();
    }
}

//ini pake cookie
//  const token = req.cookies.accessToken;
//     if(!token){
//         res.status(501).json({
//             errors : "Unauthorized"
//         });
//     }
//     else{
//         const tokenDecrypt = jwt.verify(token , process.env.ACCESS_TOKEN_SECRET);

//         const user = await prismaClient.user.findFirst({
//         where : {
//             id : tokenDecrypt.id
//         }
//          });

//          if(!user || user.status === "not_verified"){
//             res.status(501).json({
//             errors : "Unauthorized"
//         }).end();
//          }else{
//             req.user = user;
//             next();
//          }

//     }

// export const authMiddleware = async (req, res, next) => {
//   try {
//     const authorization = req.headers.authorization;

//     if (!authorization) {
//       return res.status(403).json({
//         status: 403,
//         data: null
//       });
//     }

//     const [prefix, token] = authorization.split(" ");

//     if (prefix !== "Bearer" || !token) {
//       return res.status(403).json({
//         status: 403,
//         data: null
//       });
//     }

//     let tokenDecrypt;
//     try {
//       tokenDecrypt = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
//     } catch (err) {
//       if (err.name === "TokenExpiredError") {
//         return res.status(403).json({
//           status: 403,
//           data: null,
//           message: "Access token expired",
//           redirect: "/api/users/token"
//         });
//       }

//       return res.status(403).json({
//         status: 403,
//         data: null,
//         message: "Invalid token"
//       });
//     }

//     const user = await prismaClient.user.findUnique({
//       where: { id: tokenDecrypt.id }
//     });

//     if (!user) {
//       return res.status(404).json({
//         status: 404,
//         data: null,
//         message: "User not found"
//       });
//     }

//     req.user = user;
//     next();
//   } catch (e) {
//     next(e);
//   }
// };
