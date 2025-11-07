import nodemailer from "nodemailer"
import dotenv from "dotenv"
import { responseError } from "../error/response-error.js";

dotenv.config();

export const sendOTP = async(email , otp)=>{
    try {
        const transporter = nodemailer.createTransport({
    service : "gmail",
    auth : {
        user : process.env.EMAIL_USERNAME,
        pass : process.env.EMAIL_PASSWORD
    }
});

     await transporter.sendMail({
        from :`"Perpustakaan Digital" <${process.env.EMAIL_USERNAME}>`,
        to : email,
        subject : "Kode OTP Aktivasi Akun Perpustakaan",
        html: `
        <h3>Halo!</h3>
        <p>Kode OTP aktivasi akun kamu adalah:</p>
        <h1>${otp}</h1>
        <p>Kode ini berlaku selama <b>1 Jam</b>.</p>
         `,
    });
        
    } catch (e) {
        console.log(e.message)
        throw new responseError(500 , "Gagal Send email , silahkan cek log server");
    }
}

export const sendLink = async(email , tokenChangePassword)=>{
    try {
        const transporter = nodemailer.createTransport({
    service : "gmail",
    auth : {
        user : process.env.EMAIL_USERNAME,
        pass : process.env.EMAIL_PASSWORD
    }
});

     await transporter.sendMail({
        from :`"Perpustakaan Digital" <${process.env.EMAIL_USERNAME}>`,
        to : email,
        subject : "Verifikasi Penggantian Password Akun Perpustakaan",
        html: `
        <h3>Halo!</h3>
        <p>Link Pergantian password kamu adalah:</p>
        <h1>
        <a href="http://localhost:9999/api/users/changePassword/${tokenChangePassword}">klik ini</a>
        </h1>
        <p>Link Ini berlaku selama 1 jam</p>
         `,

         //disini jangan lupa ganti href nya dan kalo bisa pake button nanti omongin ama fe dulu pokok e
    });
        
    } catch (e) {
        console.log(e.message)
        throw new responseError(500 , "Gagal Send email , silahkan cek log server");
    }
}

// (async()=>{
//     try {
//         await sendMail("ridhofirdaus321@gmail.com" , "testing" , "<p>Hello World</p>");
//         console.log("Berhasil")
        
//     } catch (e) {
//       console.log("gagal : " , e)  
//     }
// })();