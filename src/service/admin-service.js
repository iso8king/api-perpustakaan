import { prismaClient } from "../application/database.js";
import { responseError } from "../error/response-error.js";
import { validate } from "../validation/validate.js";
import { createBukuValidation, getBukuValidation, searchBukuValidation, updateBukuValidation } from "../validation/admin-validation.js";


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

const getAllBuku = async()=>{
    return prismaClient.book.findMany();
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



export default{
    createBuku,getBuku,updateBuku,deleteBuku,getAllBuku,search_buku
}
