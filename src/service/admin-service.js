import { prismaClient } from "../application/database.js";
import { responseError } from "../error/response-error.js";
import { validate } from "../validation/validate.js";
import { createBukuValidation, getBukuValidation, updateBukuValidation } from "../validation/admin-validation.js";

const selectBuku = {

            id : true,
            judul : true,
            pengarang :true,
            penerbit : true,
            tahun_terbit : true,
            kategori : true,
            stok : true
        
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

    const data = {};
    const fieldDB = ['judul', 'pengarang', 'penerbit', 'tahun_terbit', 'kategori', 'stok'];

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



export default{
    createBuku,getBuku,updateBuku,deleteBuku
}
