import Joi from "joi"

export const createPeminjamanValidation = Joi.object({
    // user_id : Joi.number().min(1).required(),
    buku_id : Joi.number().min(1).required(),
    tanggal_pinjam : Joi.date().iso().required(),
    tenggat_kembali : Joi.date().iso().required()
})