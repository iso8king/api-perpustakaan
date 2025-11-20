import { prismaClient } from "../application/database.js";
import { responseError } from "../error/response-error.js";
import { validate } from "../validation/validate.js";
import { createBukuValidation, getAllValidation, getBukuValidation, idPeminjamanValidation, idPengembalianValidation, searchBukuValidation, searchPeminjamanValidation, updateBukuValidation, validatePeminjamanValidation, validatePengembalianValidation } from "../validation/admin-validation.js";


const selectBuku = {

            id : true,
            judul : true,
            penulis :true,
            penerbit : true,
            tahun_terbit : true,
            kategori : true,
            stok : true,
            isFeatured : true
        
}

const createBuku = async(request)=>{
    request = validate(createBukuValidation , request);

    return prismaClient.book.create({
        data : request,
        select : selectBuku
    })
}

const getBuku = async(idBuku) =>{
    const id_buku = validate(getBukuValidation , idBuku);

    const buku = await prismaClient.book.findUnique({
        where : {
            id : id_buku
        },
        select : selectBuku
    });

    if(!buku) throw new responseError(404 , "Buku Tidak ditemukan!");

    return buku;
}

const updateBuku = async(request) =>{
    request = validate(updateBukuValidation , request);
    console.log(request);

    const data = {};
    const fieldDB = ['judul', 'penulis', 'penerbit', 'tahun_terbit', 'kategori', 'stok',"isFeatured"];

    //kenapa begini, karena pake patch cek admin validation updateBukuValidation ama adminRouter
   
    for (const field of fieldDB) {
        if (request[field] !== undefined) {
            data[field] = request[field];
        }
    }

    if(Object.keys(data).length === 0) throw new responseError(400 , "Tidak Ada data yang di ubah");


    const buku = await prismaClient.book.update({
        where : {
            id : request.id
        },data : data,
        select : selectBuku
    });

    if(!buku) throw new responseError(404 , "Buku not found!");

    return buku;
}

const deleteBuku = async(id)=> {
    id = validate(getBukuValidation , id);

    const deleteBook = await prismaClient.book.delete({
        where : { id : id}
    });

    if(!deleteBook) throw new responseError(404 , "Buku Tidak Di temukan");
}

const getAllBuku = async(request)=>{
    request = validate(getAllValidation,request)
    const skip = (request.page - 1) * request.size;
    const buku = await prismaClient.book.findMany({
        select : selectBuku,
        skip : skip,
        take : request.size,
        orderBy : {
            id : "desc"
        }
    });

    const totalItems = await prismaClient.book.count();

    return{
        data : buku,
        paging : {
            page : request.page,
            totalItems : totalItems,
            totalPage :  Math.ceil(totalItems/ request.size)
        }
    }
}

const search_buku = async(request) => {
    request = validate(searchBukuValidation , request);

    const filters = [];
    const skip = (request.page - 1) * request.size;

    if(request.judul){
        filters.push({
            judul : {
                contains : request.judul,
                // mode: 'insensitive'
            }
        })
    }

    if(request.kategori){
        filters.push({
            kategori : {
                contains : request.kategori,
                // mode: 'insensitive'
            }
        })
    }

     if(request.featured !== undefined){
        filters.push({
            isFeatured : {
                equals : request.featured,
                // mode: 'insensitive'
            }
        })
    }


    const buku = await prismaClient.book.findMany({
        where : {
            AND : filters
        },
        skip : skip,
        take : request.size,
        select : selectBuku
        
    })

    const totalItems = await prismaClient.book.count({
        where : {
            AND : filters
        }
    });

    return{
        data : buku,
        paging : {
            page : request.page,
            totalItems : totalItems,
            totalPage :  Math.ceil(totalItems/ request.size)
        }
    }
}

const getAllPeminjaman = async(request)=>{
    request = validate(getAllValidation,request)
    const skip = (request.page - 1) * request.size;
    const peminjaman = await prismaClient.peminjaman.findMany({
        skip : skip,
        take : request.size,
        orderBy : {
            id : "desc"
        },
        include : {
            user : {select : {nama : true}},
            buku : {select : {judul : true}}
        }
    });

    const totalItems = await prismaClient.book.count();

    return{
        data : peminjaman,
        paging : {
            page : request.page,
            totalItems : totalItems,
            totalPage :  Math.ceil(totalItems/ request.size)
        }
    }
}

const searchPeminjaman = async(request)=>{
    request = validate(searchPeminjamanValidation,request);
    const skip = (request.page - 1) * request.size;
    const filters = []
    if(request.nama_user){
        filters.push({
            user : {
                nama : {
                    contains : request.nama_user
                }
            }
        })
    }
    if(request.judul_buku){
        filters.push({
            buku : {
                judul : {
                    contains : request.judul_buku
                }
             } 
        })
    }

    
    const peminjaman = await prismaClient.peminjaman.findMany({
        where : {
            AND : filters
        },skip : skip,
        take : request.size,
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

    const totalItems = await prismaClient.peminjaman.count({
        where: {
            AND : filters
        }
    })

    return{
        data : peminjaman,
        paging : {
            page : request.page,
            totalItems : totalItems,
            totalPage :  Math.ceil(totalItems/ request.size)
        }
    }
};

const validatePeminjaman = async(request) => {
    request = validate(validatePeminjamanValidation , request);

    const checkPeminjaman = await prismaClient.peminjaman.findUnique({
        where : {
            id : request.id_peminjaman
        },select : {
            valid : true
        }
    });

    if(!checkPeminjaman) throw new responseError(404 , "Peminjaman Not Found")
    if(checkPeminjaman.valid) throw new responseError(410 , "Sudah di Validasi");

    return prismaClient.peminjaman.update({
        where : {
            id : request.id_peminjaman
        },
        data : {
            valid : true,
            status : "Dipinjam"
        }
    })
}

const return_book = async(request) => {
    request = validate(validatePengembalianValidation,request);
    const return_date = new Date();
    let denda = 0;

    const peminjaman = await prismaClient.peminjaman.findUnique({
        where : {
            id : request.id_peminjaman
        },select : {
            status : true,
            valid : true,
            tenggat_kembali : true,
            buku_id : true
        }
    });


    if(!peminjaman) throw new responseError(404, "Peminjaman Not Found!");
    if(!peminjaman.valid) throw new responseError(403 , "Peminjaman Belum Di validasi");
    if(peminjaman.status === "Dikembalikan") throw new responseError(409 , "Peminjaman Sudah Dikembalikan");

    const due_date = new Date(peminjaman.tenggat_kembali);
    let selisih = 0;

    if(peminjaman.tenggat_kembali < return_date) {
        denda = denda + 5000
        selisih = Math.ceil((return_date - due_date) / (1000 * 60 *60 * 24));
    }

    if(request.kondisi_buku === "Rusak"){
        denda = denda + 10000
    }else if(request.kondisi_buku === "Hilang"){
        denda = denda + 100000
    }

   const [pengembalian] = await prismaClient.$transaction([
    prismaClient.pengembalian.create({
        data : {
           peminjaman_id : request.id_peminjaman,
           denda : denda,
           tanggal_dikembalikan : return_date,
           hari_telat : selisih,
           kondisi_buku : request.kondisi_buku 
        }
   }),

   prismaClient.book.update({
    where : {
        id : peminjaman.buku_id
    },data : {
        stok : {increment : 1}
    }
   }),

  prismaClient.peminjaman.update({
    where : {
        id : request.id_peminjaman
    },data : {
        status : "Dikembalikan"
    }}) 
])

   return pengembalian
}

const statistik_perpus = async()=>{
    const total_buku = await prismaClient.book.count();
    const total_anggota = await prismaClient.user.count({
        where : {
            role : "user"
        }
    });
    const buku_dipinjam = await prismaClient.peminjaman.count({
        where : {
            status : "Dipinjam"
        }
    });

    const buku_terlambat = await prismaClient.pengembalian.count({
        where : {
            hari_telat : {
                gt : 0
            }
        }
    });

    

    return {
        total_buku : total_buku,
        total_anggota : total_anggota,
        buku_dipinjam : buku_dipinjam,
        buku_terlambat : buku_terlambat
    }
}

const detail_pengembalian = async(id_peminjaman , user)=>{
    id_peminjaman = validate(idPengembalianValidation,id_peminjaman);

    if(user.role !== "admin"){
        const peminjaman = await prismaClient.peminjaman.findUnique({
        where : {
            id : id_peminjaman
        },
        select : {
            user_id : true
        }
    });

    if(peminjaman.user_id !== user.id) throw new responseError(403 , "Forbidden");
    }


    return prismaClient.pengembalian.findUnique({
        where : {
            peminjaman_id : id_peminjaman
        },include : {
            peminjaman : {
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
            }
        }
    })
}

const reject_peminjaman = async(id_peminjaman) => {
    id_peminjaman = validate(idPeminjamanValidation,id_peminjaman);

    const checkPeminjaman = await prismaClient.peminjaman.findUnique({
        where : {
            id : id_peminjaman
        },select : {
            valid : true
        }
    });

    if(!checkPeminjaman) throw new responseError(404 , "Peminjaman Not Found")
    if(checkPeminjaman.valid) throw new responseError(410 , "Sudah di Validasi");

    return prismaClient.peminjaman.delete({
        where : {
            id : id_peminjaman
        }
    })
}




export default{
    detail_pengembalian,reject_peminjaman,searchPeminjaman,validatePeminjaman,statistik_perpus,createBuku,getBuku,updateBuku,return_book,deleteBuku,getAllBuku,search_buku,getAllPeminjaman
}
