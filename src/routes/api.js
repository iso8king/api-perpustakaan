import express from "express";
import { authMiddleware, roleMiddleware } from "../middleware/auth-middleware.js";
import userController from "../controller/user-controller.js";
import adminController from "../controller/admin-controller.js";
import anggotaController from "../controller/anggota-controller.js";

const userRouter = express.Router();

userRouter.delete("/api/users/logout", [authMiddleware], userController.logout);
userRouter.get("/api/users/current", [authMiddleware], userController.get);
userRouter.patch("/api/users/update", [authMiddleware], userController.updateProfile);

//admin
const adminRouter = express.Router();

adminRouter.post('/api/books/create' , [authMiddleware , roleMiddleware(["admin"])] , adminController.create_buku);
adminRouter.get('/api/books/get/:id_buku' , [authMiddleware , roleMiddleware(["admin"])] , adminController.get_buku);
adminRouter.patch('/api/books/update/:id_buku' , [authMiddleware ,  roleMiddleware(["admin"])] , adminController.update_buku);
adminRouter.delete('/api/books/delete/:id_buku' , [authMiddleware ,  roleMiddleware(["admin"])] , adminController.delete_buku);
adminRouter.get('/api/peminjaman/getAll' , [authMiddleware , roleMiddleware("admin")] , adminController.getAll_peminjaman);
adminRouter.post('/api/peminjaman/validate/:id_peminjaman' , [authMiddleware , roleMiddleware("admin")] , adminController.validate_peminjaman);
adminRouter.post('/api/pengembalian/:id_peminjaman' , [authMiddleware , roleMiddleware("admin")] , adminController.create_pengembalian);
adminRouter.get('/api/peminjaman/search' , [authMiddleware , roleMiddleware("admin")] , adminController.search_peminjaman);
adminRouter.get('/api/pengembalian/:id_peminjaman' , [authMiddleware ] , adminController.detail_pengembalian);
adminRouter.delete('/api/peminjaman/reject/:id_peminjaman' , [authMiddleware , roleMiddleware("admin")] , adminController.reject_peminjaman);

//anggota
const anggotaRouter = express.Router();
anggotaRouter.post('/api/peminjaman/create' , [authMiddleware , roleMiddleware(["user"])],anggotaController.createPeminjaman)
anggotaRouter.get('/api/peminjaman/get' , [authMiddleware , roleMiddleware(["user"])],anggotaController.getPeminjamanUser);
anggotaRouter.get('/api/statistik/anggota' , [authMiddleware , roleMiddleware("user")] , anggotaController.getStatistikUser);

export { userRouter , adminRouter , anggotaRouter};
