import { prismaClient } from "../application/database.js";
import { responseError } from "../error/response-error.js";
import { createPeminjamanValidation, getUserPeminjamanValidation } from "../validation/anggota-validation.js";
import { validate } from "../validation/validate.js";

const createPeminjaman = async(request , user_id)=>{
    request.tanggal_pinjam = new Date();
    request.tenggat_kembali = new Date(Date.now() + 14*24*60*60*1000); //ini 2 minggu / 14 hari
    
    request = validate(createPeminjamanValidation , request);
    request.user_id = user_id

    return prismaClient.$transaction(async(trx)=> {
    const checkBookInDb = await trx.book.findUnique({
        where : {
            id : request.buku_id
        },select : {
            stok : true
        }
    })
    if(!checkBookInDb) throw new responseError(404, "Buku Not Found");
    if(checkBookInDb.stok < 1) throw new responseError(409 , "Peminjaman Gagal karena stok habis");

    //udah pernah minjem buku yang sama tapi belo, dibalikin?
    const existingLoan = await trx.peminjaman.findFirst({
    where: {
        user_id: user_id,
        buku_id: request.buku_id,
        status: "Dipinjam"
    }
    });

    if(existingLoan) throw new responseError(410,"Anda Masih Meminjam Buku ini")

    const stokDecrease = await trx.book.update({
        where : {
            id : request.buku_id
        },data : {
            stok : checkBookInDb.stok - 1
        }
    })

    return trx.peminjaman.create({
        data : request,
        include : {
            user : {
                select : {
                    nama : true
                }
            },
            buku : {
                select : {
                    judul : true
                }
            }
        }
    });


    })
    
}

const getUserPeminjaman = async(request , id_user)=>{
    request = validate(getUserPeminjamanValidation,request);
    const skip = (request.page - 1) * request.size;

    const user = await prismaClient.peminjaman.findMany({
        where : {
            user_id : id_user
        },take : request.size,
        skip : skip
    });

    const totalItems = await prismaClient.peminjaman.count({
        where : {
            user_id : id_user
        }
    })

     return{
        data : user,
        paging : {
            page : request.page,
            totalItems : totalItems,
            totalPage :  Math.ceil(totalItems/ request.size)
        }
    }
}

export default{
    createPeminjaman , getUserPeminjaman
}





