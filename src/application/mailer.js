import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { responseError } from "../error/response-error.js";

dotenv.config();

export const sendOTP = async (email, otp) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: `"Perpustakaan Digital" <${process.env.EMAIL_USERNAME}>`,
      to: email,
      subject: "Kode OTP Aktivasi Akun Perpustakaan",
      html: `
        <h3>Halo!</h3>
        <p>Kode OTP aktivasi akun kamu adalah:</p>
        <h1>${otp}</h1>
        <p>Kode ini berlaku selama <b>1 Jam</b>.</p>
         `,
    });
  } catch (e) {
    console.log(e.message);
    throw new responseError(500, "Gagal Send email , silahkan cek log server");
  }
};

export const sendLink = async (email, token, subject, type = "activate") => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    // Tentukan URL front-end berdasarkan environment
    const baseUrl =
      process.env.NODE_ENV === "production"
        ? process.env.FRONTEND_URL // misal: https://perpusdigital.vercel.app
        : "http://localhost:3000";

    // Tentukan path berdasarkan jenis email
    const path = type === "reset" ? `/auth/resetPassword?code=${token}` : `/auth/activate?code=${token}`;

    const link = `${baseUrl}${path}`;

    const actionText = type === "reset" ? "reset password akun kamu" : "aktivasi akun kamu";

    await transporter.sendMail({
      from: `"Perpustakaan Digital" <${process.env.EMAIL_USERNAME}>`,
      to: email,
      subject: `${subject}`,
      html: `
        <h3>Halo!</h3>
        <p>Berikut adalah link untuk ${actionText}:</p>
        <a href="${link}" style="
          display: inline-block;
          padding: 10px 20px;
          background-color: #007BFF;
          color: white;
          border-radius: 5px;
          text-decoration: none;
        ">Klik di sini</a>
      `,
    });
  } catch (e) {
    console.error("Gagal mengirim email:", e.message);
    throw new responseError(500, "Gagal mengirim email, silakan cek log server");
  }
};

// (async()=>{
//     try {
//         await sendMail("ridhofirdaus321@gmail.com" , "testing" , "<p>Hello World</p>");
//         console.log("Berhasil")

//     } catch (e) {
//       console.log("gagal : " , e)
//     }
// })();
