import Joi from "joi"

export const registerUserValidation = Joi.object({
    email : Joi.string().email().max(100).required(),
    password : Joi.string().max(100).required(),
    nama : Joi.string().max(100).required(),
    role : Joi.string().valid("admin" , "user")
})