import Joi from "joi"

export const createPeminjamanValidation = Joi.object({
    // user_id : Joi.number().min(1).required(),
    buku_id : Joi.number().min(1).required(),
    tanggal_pinjam : Joi.date().iso().required(),
    tenggat_kembali : Joi.date().iso().required()
})

export const getUserPeminjamanValidation = Joi.object({
    page : Joi.number().min(1).positive().default(1),
    size : Joi.number().min(1).max(100).default(10)
})

export const peminjamanPaketValidation = Joi.number().min(1).required();