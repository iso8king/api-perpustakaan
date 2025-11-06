import Joi from "joi"

export const registerUserValidation = Joi.object({
    email : Joi.string().email().max(100).required(),
    password : Joi.string().max(100).required(),
    nama : Joi.string().max(100).required(),
    role : Joi.string().valid("admin" , "user"),
    // otp : Joi.string().max(100).required(),
    // otpExp : Joi.date().iso().required()
})

export const otpVerificationValidation = Joi.object({
    id : Joi.number().required().min(1),
    otp : Joi.string().required()
})