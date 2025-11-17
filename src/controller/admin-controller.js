import adminService from "../service/admin-service.js";


const create_buku = async(req,res,next)=>{
    try {
        const request = req.body;
        const result = await adminService.createBuku(request);
        res.status(200).json({
            data : result
        });
        
    } catch (e) {
        next(e)        
    }
}

const get_buku = async(req,res,next)=>{
    try {
    const id_buku = req.params.id_buku;
    const result = await adminService.getBuku(id_buku);
    res.status(200).json({
        data : result
    })
        
    } catch (e) {
        next(e);       
    }
}

const update_buku = async(req,res,next)=>{
    try {
        const id_buku = req.params.id_buku;
        const request = req.body;
        request.id = id_buku;

        const result = await adminService.updateBuku(request);
        res.status(200).json({
            data : result
        })
        
    } catch (e) {
        next(e);        
    }
}

const delete_buku = async(req,res,next)=>{
    try {
        const id = req.params.id_buku;
        await adminService.deleteBuku(id);
        
        res.status(200).json({
            data : "OK"
        }) 
        
    } catch (e) {
        next(e);        
    }
}

const getAll_buku = async(req,res,next)=>{
    try {
        const page = req.query.page;
        const size = req.query.size;
        const request = {
            page,
            size
        }

        const result = await adminService.getAllBuku(request);
        res.status(200).json({
        data : result.data,
        paging : result.paging
    })
        
    } catch (e) {
        next(e)        
    }
}

const getAll_peminjaman = async(req,res,next)=>{
    try {
        const page = req.query.page;
        const size = req.query.size;
        const request = {
            page,
            size
        }

        const result = await adminService.getAllPeminjaman(request);
        res.status(200).json({
        data : result.data,
        paging : result.paging
    })
        
    } catch (e) {
        next(e)        
    }
}

const search_buku = async(req,res,next)=>{
    try {
    const size = req.query.size;
    const page = req.query.page;
    const judul = req.query.judul;
    const kategori = req.query.kategori;
    const featured = req.query.featured;
    const request = {
        page,
        size,
        judul,
        kategori,
        featured
    }

    const result = await adminService.search_buku(request);
    res.status(200).json({
        data : result.data,
        paging : result.paging
    })
        
    } catch (e) {
        next(e)        
    }
}

const validate_peminjaman = async(req,res,next)=> {
    try {
        const request = {
            id_peminjaman : req.params.id_peminjaman
        }

        const result = await adminService.validatePeminjaman(request);
        res.status(200).json({
            data : "Success"
        })
        
    } catch (e) {
        next(e);       
    }
}

const create_pengembalian = async(req,res,next)=>{
    try {
        const request = req.body;
        request.id_peminjaman = req.params.id_peminjaman
        const result = await adminService.return_book(request);

        res.status(200).json({
            data : result
        })
        
    } catch (e) {
        next(e)        
    }
}

const countDashboard = async(req,res,next)=>{
    try {
        const result = await adminService.statistik_perpus();
        res.status(200).json({
            data : result
        })
        
    } catch (e) {
        next(e)        
    }
}

const search_peminjaman = async(req,res,next)=>{
    try {
        const request = {
            page : req.query.page,
            size : req.query.page,
            nama_user : req.query.user,
            judul_buku : req.query.buku
        }

        const result = await adminService.searchPeminjaman(request);
        res.status(200).json({
        data : result.data,
        paging : result.paging
        })
        
    } catch (e) {
        next(e);        
    }
}

export default {
    countDashboard,search_peminjaman,create_pengembalian,create_buku,get_buku,update_buku,delete_buku,getAll_buku,search_buku,getAll_peminjaman,validate_peminjaman
}