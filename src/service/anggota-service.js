import { prismaClient } from "../application/database.js";
import { responseError } from "../error/response-error.js";
import { createPeminjamanValidation, getUserPeminjamanValidation, peminjamanPaketValidation } from "../validation/anggota-validation.js";
import { validate } from "../validation/validate.js";

function getTenggatJuni(userDate = new Date()) {
  const year = userDate.getFullYear();
  const month = userDate.getMonth();
  const day = userDate.getDate();

  let targetYear = year;
  if (month > 5) {
    targetYear = year + 1;
  }

  return new Date(targetYear, 5, day, 23, 59, 59, 999);
}

const createPeminjaman = async(request , user_id)=>{
    request.tanggal_pinjam = new Date();
    request.tenggat_kembali = new Date(Date.now() + 3*24*60*60*1000); 
    
    request = validate(createPeminjamanValidation , request);
    request.user_id = user_id
    

    return prismaClient.$transaction(async(trx)=> {
    const checkBookInDb = await trx.book.findUnique({
        where : {
            id : request.buku_id
        },select : {
            stok : true,
            buku_paket : true
        }
    });

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

    if(existingLoan) throw new responseError(410,"Anda Masih Meminjam Buku ini");

    if(checkBookInDb.buku_paket){
    const tenggat = getTenggatJuni(new Date());
    request.tenggat_kembali = tenggat;
    }

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
                    nama : true,
                    kelas : true
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
        skip : skip,
        orderBy : {
            id : "desc"
        },
        include : {
            buku : {
                select : {
                    judul : true
                }
            },user : {
                select : {
                    nama : true,
                    kelas : true
                }
            }
        }
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

const statistik_user = async(id_user) => {
    const dipinjam = await prismaClient.peminjaman.count({
        where : {
            user_id : id_user,
            status : "Dipinjam"
        }
    });

    const konfirmasi = await prismaClient.peminjaman.count({
        where : {
            user_id : id_user,
            status : "Diproses"
        }
    });

    const awalHari = new Date();
    awalHari.setUTCHours(0,0,0,0);

    const akhirHari = new Date();
    akhirHari.setUTCHours(23,59,59,999);

    const jatuh_tempo = await prismaClient.peminjaman.count({
        where : {
            user_id : id_user,
            tenggat_kembali : {
                gte : awalHari,
                lte : akhirHari
            }

        }
    });

    const terlambat = await prismaClient.pengembalian.count({
        where : {
            peminjaman : {
                user_id : id_user
            },
            hari_telat : {
                gte : 1 
            }
        }
    });

    const riwayat_peminjaman = await prismaClient.peminjaman.count({
        where: {
            status : "Dikembalikan",
            user_id : id_user
        }
    });

    const total_peminjaman = await prismaClient.peminjaman.count({
        where : {
            user_id : id_user
        }
    });

    return {
        dipinjam, 
        konfirmasi,
        jatuh_tempo,
        terlambat,
        riwayat_peminjaman,
        total_peminjaman
    }


}

const pinjam_paket = async(id_buku , user_id)=>{
    id_buku = validate(peminjamanPaketValidation , id_buku);
    
    const buku = await prismaClient.book.findFirst({
        where : {
            id : id_buku
        },select : {
            buku_paket : true
        }
    });

    if(buku.buku_paket === false) throw new responseError(403 , "Bukan Buku Paket,Tolong pinjam di route yang berbeda");
    if(!buku) throw new responseError(404 , "Buku Not Found");

}

export default{
    createPeminjaman , getUserPeminjaman,statistik_user,pinjam_paket
}





