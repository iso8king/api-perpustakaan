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

export default {
    create_buku,get_buku,update_buku,delete_buku,getAll_buku,search_buku
}
