import jwt from "jsonwebtoken"
import { responseError } from "../error/response-error.js"
import { prismaClient } from "../application/database.js";

export const authMiddleware = async(req,res,next)=>{
   
    const token = req.cookies.accessToken;
    if(!token){
        res.status(501).json({
            errors : "Unauthorized"
        });
    }
    else{
        const tokenDecrypt = jwt.verify(token , process.env.ACCESS_TOKEN_SECRET);

        const user = await prismaClient.user.findFirst({
        where : {
            id : tokenDecrypt.id
        }
         });
        
         if(!user || user.status === "not_verified"){
            res.status(501).json({
            errors : "Unauthorized"
        }).end();
         }else{
            req.user = user;
            next();
         }

    }
}
