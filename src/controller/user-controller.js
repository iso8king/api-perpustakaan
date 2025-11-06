import userService from "../service/user-service.js";

const register = async(req,res,next)=>{
    try {
        const result = await userService.register(req.body);
        res.status(200).json({
            data : result
        })
        
    } catch (e) {
        next(e);      
    }
}

const otpValidation = async(req,res,next)=>{
    try {
        const result = await userService.verifyOTP(req.body);
        res.status(200).json({
            data : result
        })
        
    } catch (e) {
        next(e)   
    }
}

export default {
    register,otpValidation
}