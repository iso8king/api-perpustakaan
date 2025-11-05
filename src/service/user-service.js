import { web } from "../application/web.js";
import { prismaClient } from "../application/database.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { responseError } from "../error/response-error.js";
import { registerUserValidation } from "../validation/user-validation.js";
import { validate } from "../validation/validate.js";

const register = async(request)=>{
    const user = validate(registerUserValidation , request);
    console.log(user)

    user.password = await bcrypt.hash(user.password , 10);

    const registerUser = await prismaClient.user.create({
        data : user
    });

    return registerUser;
    
}

export default{
    register
}