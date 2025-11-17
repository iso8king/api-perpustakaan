import anggotaService from "../service/anggota-service.js";

const createPeminjaman = async(req,res,next) => {
    try {
        const user_id = req.user.id;
        const request = req.body;
        const result = await anggotaService.createPeminjaman(request , user_id);

        res.status(200).json({
            data : result
        })
        
    } catch (e) {
        next(e)
    }
}

const getPeminjamanUser = async(req,res,next)=>{
    try {
        const id_user = req.user.id;
        const request = {
            page : req.query.page,
            size : req.query.size
        }
        const result = await anggotaService.getUserPeminjaman(request,id_user);
        res.status(200).json({
        data : result.data,
        paging : result.paging
        })
        
    } catch (e) {
        next(e)        
    }
}

export default {
    createPeminjaman,getPeminjamanUser 
}