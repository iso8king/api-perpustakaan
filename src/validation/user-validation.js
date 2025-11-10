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
    email : Joi.string().required().email(),
    otp : Joi.string().required()
});

export const loginUserValidation = Joi.object({
    email : Joi.string().max(100).required(),
    password : Joi.string().max(100).required()
})

export const getUserValidation = Joi.string().max(100).required();
export const emailUserValidation = Joi.string().max(100).email().required();



export const updateUserValidation = Joi.object({
    email : Joi.string().email().max(100).optional(),
    nama : Joi.string().max(100).optional(),
    id : Joi.number().min(1).required(),
    emailFirst : Joi.string().email().max(100).required()
})

export const emailUserValidation2 = Joi.object({
    email : Joi.string().max(100).email().required()
})

export const changePasswordUserValidation = Joi.object({
    password : Joi.string().max(100).required(),
    token : Joi.string().required()
})