import nodemailer from "nodemailer"
import dotenv from "dotenv"

dotenv.config();

export const sendOTP = async(email , otp)=>{
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
}

// (async()=>{
//     try {
//         await sendMail("ridhofirdaus321@gmail.com" , "testing" , "<p>Hello World</p>");
//         console.log("Berhasil")
        
//     } catch (e) {
//       console.log("gagal : " , e)  
//     }
// })();