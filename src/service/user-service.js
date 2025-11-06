import { web } from "../application/web.js";
import { prismaClient } from "../application/database.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { responseError } from "../error/response-error.js";
import { otpVerificationValidation, registerUserValidation } from "../validation/user-validation.js";
import { validate } from "../validation/validate.js";
import { sendMail, sendOTP } from "../application/mailer.js";

function generateOTP(){
    return Math.floor(1000 + Math.random() * 9000).toString()
}

const register = async(request)=>{
    const user = validate(registerUserValidation , request);
    console.log(user)

    user.password = await bcrypt.hash(user.password , 10);
    const otp = generateOTP();
    const otpHash = await bcrypt.hash(otp , 10);
    user.otp = otpHash;

    const otpExp = new Date(Date.now() + 60 * 60 * 1000);
    user.otpExp = otpExp

    const registerUser = await prismaClient.user.create({
        data : user,
        select : {
            id : true,
            email : true,
            nama : true,
            role : true,
            status : true
        }
    });

    await sendOTP(user.email , otp);
    

    return registerUser;
    
}

const verifyOTP = async(request) => {
    const otpRequest = validate(otpVerificationValidation , request);

    const user = await prismaClient.user.findUnique({
        where : {
            id : otpRequest.id
        },
        select : {
            otp : true,
            otpExp : true,
            status : true
        }
    });

    if(!user){
        throw new responseError(404 , "User Not Found!");
    }

    if(user.otpExp.getTime() < Date.now() || user.status === "verified"){
        throw new responseError(410 , "User Already verified or otp already expired!")
    }

    const otpCheck = await bcrypt.compare(otpRequest.otp , user.otp);

    if(otpCheck === false) throw new responseError(400 , "OTP wrong!");

    await prismaClient.user.update({
        where  : {
            id : otpRequest.id
        },
        data : {
            status : "verified",
            otp : null,
            otpExp : null
        }
    })

    return "Akun Berhasil Di Verifikasi"
}

export default{
    register,verifyOTP
}