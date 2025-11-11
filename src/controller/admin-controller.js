import adminService from "../service/admin-service.js";
import userService from "../service/user-service.js";

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

export default {
    create_buku,get_buku,update_buku,delete_buku
}