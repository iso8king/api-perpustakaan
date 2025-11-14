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

//anggota
const anggotaRouter = express.Router();
anggotaRouter.post('/api/peminjaman/create' , [authMiddleware , roleMiddleware(["user"])],anggotaController.createPeminjaman)

export { userRouter , adminRouter , anggotaRouter};
