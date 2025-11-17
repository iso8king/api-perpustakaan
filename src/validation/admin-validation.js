import Joi from "joi"

export const createBukuValidation = Joi.object({
    judul : Joi.string().max(100).required(),
    penulis : Joi.string().max(100).required(),
    penerbit : Joi.string().max(100).required(),
    tahun_terbit : Joi.number().integer().min(1900).max(new Date().getFullYear()).required(),
    kategori : Joi.string().max(50).required(),
    stok : Joi.number().min(1).required(),
    isFeatured : Joi.boolean().optional()
})

export const getBukuValidation = Joi.number().min(1).required();

export const updateBukuValidation = Joi.object({
    id : Joi.number().min(1).required(),
    judul : Joi.string().max(100).optional(),
    penulis : Joi.string().max(100).optional(),
    penerbit : Joi.string().max(100).optional(),
    tahun_terbit : Joi.number().integer().min(1900).max(new Date().getFullYear()).optional(),
    kategori : Joi.string().max(50).optional(),
    stok : Joi.number().min(1).optional(),
    isFeatured : Joi.boolean().optional()
})

export const searchBukuValidation = Joi.object({
    page : Joi.number().min(1).positive().default(1),
    size : Joi.number().min(1).max(100).default(10),
    judul : Joi.string().min(1).optional(),
    kategori : Joi.string().min(1).optional(),
    featured : Joi.bool().optional()
})

export const searchPeminjamanValidation = Joi.object({
    page : Joi.number().min(1).positive().default(1),
    size : Joi.number().min(1).max(100).default(10),
    nama_user : Joi.string().max(100).optional(),
    judul_buku : Joi.string().max(100).optional()
})

export const getAllValidation = Joi.object({
    page : Joi.number().min(1).positive().default(1),
    size : Joi.number().min(1).max(100).default(10)
})

export const validatePeminjamanValidation = Joi.object({
    id_peminjaman : Joi.number().min(1).required(),
})

export const validatePengembalianValidation = Joi.object({
    id_peminjaman : Joi.number().min(1).required(),
    kondisi_buku : Joi.string().valid("Baik" , "Rusak" , "Hilang").required()
})