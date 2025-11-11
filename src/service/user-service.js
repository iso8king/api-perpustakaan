import { prismaClient } from "../application/database.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { responseError } from "../error/response-error.js";
import {
  changePasswordUserValidation,
  emailUserValidation,
  emailUserValidation2,
  loginUserValidation,
  otpVerificationValidation,
  registerUserValidation,
  updateUserValidation,
} from "../validation/user-validation.js";
import { validate } from "../validation/validate.js";
import { sendLink, sendOTP } from "../application/mailer.js";
import crypto from "crypto";

function generateOTP() {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

function generateJWT(id, email, secret_token, duration) {
  return jwt.sign(
    {
      id: id,
      email: email,
    },
    secret_token,
    {
      expiresIn: duration,
    },
  );
}

const register = async (request) => {
  const user = validate(registerUserValidation, request);
//   console.log(user);
  user.role = "user";

  user.password = await bcrypt.hash(user.password, 10);
  // const otp = generateOTP();
  // const otpHash = await bcrypt.hash(otp , 10);
  // user.otp = otpHash;

  // const otpExp = new Date(Date.now() + 60 * 60 * 1000);
  // user.otpExp = otpExp

  const token = crypto.randomBytes(32).toString("hex");
//   const linkExp = new Date(Date.now() + 60 * 60 * 1000);
  // const tokenEncrpyt = await bcrypt.hash(token , 5);
//   user.otpExp = linkExp;
  user.token = token;

  await sendLink(user.email, token, "Verifikasi Akun Perpustakaan", "activate");

  const registerUser = await prismaClient.user.create({
    data: user,
    select: {
      id: true,
      email: true,
      nama: true,
      role: true,
      status: true,
    },
  });

  return registerUser;
};

const verifyOTP = async (request) => {
  const otpRequest = validate(otpVerificationValidation, request);
  console.log(otpRequest);

  const user = await prismaClient.user.findUnique({
    where: {
      email: otpRequest.email,
    },
    select: {
      otp: true,
      otpExp: true,
      status: true,
    },
  });

  if (!user || user.otp === null || user.otpExp === null) {
    throw new responseError(404, "User or OTP Not Found!");
  }

  if (user.otpExp.getTime() < Date.now() || user.status === "verified") {
    throw new responseError(410, "User Already verified or otp already expired!");
  }

  const otpCheck = await bcrypt.compare(otpRequest.otp, user.otp);

  if (otpCheck === false) throw new responseError(400, "OTP wrong!");

  await prismaClient.user.update({
    where: {
      email: otpRequest.email,
    },
    data: {
      status: "verified",
      otp: null,
      otpExp: null,
    },
  });

  return "Akun Berhasil Di Verifikasi";
};

const login = async (request) => {
  const loginRequest = validate(loginUserValidation, request);

  const user = await prismaClient.user.findUnique({
    where: {
      email: loginRequest.email,
    },
  });

  if (!user) throw new responseError(401, "email or password wrong!");

  const passwordValid = await bcrypt.compare(loginRequest.password, user.password);
  if (!passwordValid) throw new responseError(401, "email or password wrong!");

  const tokenAccess = generateJWT(user.id, user.email, process.env.ACCESS_TOKEN_SECRET, "1h");
  const tokenRefresh = generateJWT(user.id, user.email, process.env.REFRESH_TOKEN_SECRET, "7d");

  const status = await prismaClient.user.findUnique({
    where: {
      email: user.email,
    },
    select: {
      status: true,
    },
  });

  return {
    token_access: tokenAccess,
    token_refresh: tokenRefresh,
    status: status.status,
  };
};

const token = (tokenRefresh) => {
  //   try {
  //     const token_access = jwt.verify(tokenAccess , process.env.ACCESS_TOKEN_SECRET);
  //     throw new responseError(400 , "Token Masih belum expired");
  // } catch (e) {
  //     if(e.name !== 'TokenExpiredError' || e.name !== 'Token Masih belum expired'){
  //         console.log(e)
  //         throw new responseError(401 , "Token tidak valid");
  //     }else if(e.name === 'TokenExpiredError'){
  //     const refresh_token = jwt.verify(tokenRefresh ,process.env.REFRESH_TOKEN_SECRET);

  //     const tokenAccessNew = generateJWT(refresh_token.id , refresh_token.email , process.env.ACCESS_TOKEN_SECRET , "1h");
  //     const tokenRefreshNew = generateJWT(refresh_token.id , refresh_token.email , process.env.REFRESH_TOKEN_SECRET , "7d");

  //     return {
  //         tokenAccess : tokenAccessNew,
  //         tokenRefresh : tokenRefreshNew
  //     }
  //     }
  // }

  if (!tokenRefresh) throw new responseError(404, "token refresh not found!");

  const refresh_token = jwt.verify(tokenRefresh, process.env.REFRESH_TOKEN_SECRET);

  const tokenAccessNew = generateJWT(refresh_token.id, refresh_token.email, process.env.ACCESS_TOKEN_SECRET, "1h");
  const tokenRefreshNew = generateJWT(refresh_token.id, refresh_token.email, process.env.REFRESH_TOKEN_SECRET, "7d");

  return {
    tokenAccess: tokenAccessNew,
    tokenRefresh: tokenRefreshNew,
  };
};

// const change_password = async(email)=>{
//     const emailValidate = validate(emailUserValidation , email);
// }  nanti dah pusing gw ini anjg

const getUser = async (email) => {
  const emailValidate = validate(emailUserValidation, email);

  const user = await prismaClient.user.findUnique({
    where: {
      email: emailValidate,
    },
    select: {
      id: true,
      email: true,
      nama: true,
      role: true,
      status: true,
    },
  });

  if (!user) throw new responseError(404, "User Not Found!");

  return user;
};

//tinggal bikin forgot password sama update data
const updateProfile = async (request) => {
  request = validate(updateUserValidation, request);
  const data = {}

  const validateUser = await prismaClient.user.count({
    where: {
      id: request.id,
    }
  });

  if (!validateUser) {
    throw new responseError(404, "User Not Found!");
  }

  data.email = request.emailFirst;

  if (request.nama) {
    data.nama = request.nama;
  }

  // const otp = generateOTP();
  // const otpHash = await bcrypt.hash(otp , 10);
  // data.otp = otpHash;

  // const otpExp = new Date(Date.now() + 60 * 60 * 1000);
  // data.otpExp = otpExp

//   const token = crypto.randomBytes(32).toString("hex");
//   const linkExp = new Date(Date.now() + 60 * 60 * 1000);
//   data.token = token;
//   data.otpExp = linkExp;

//   await sendLink(data.email, token, "Aktivasi Akun Perpustakaan");

  const user = await prismaClient.user.update({
    where: {
      id: request.id,
    },
    data: data,
    select: {
      email: true,
      nama: true,
      status: true,
    },
  });

  return user;
};

const forgotPasswordCheckEmail = async (email) => {
  const emailRequest = validate(emailUserValidation2, email);

  const user = await prismaClient.user.count({
    where: {
      email: emailRequest.email,
    },
  });

  if (user !== 1) throw new responseError(404, "User Not Found!");

  const token = crypto.randomBytes(32).toString("hex");
  const linkExp = new Date(Date.now() + 60 * 60 * 1000);
  const tokenEncrpyt = await bcrypt.hash(token, 5);

  await sendLink(emailRequest.email, token, "Verifikasi Penggantian Password Akun Perpustakaan", "reset");

  await prismaClient.user.update({
    where: {
      email: emailRequest.email,
    },
    data: {
      token: tokenEncrpyt,
      otpExp: linkExp,
    },
  });
};

const changePassword = async (request) => {
  const changePassword = validate(changePasswordUserValidation, request);

  const searchUser = await prismaClient.user.findMany({
    where: {
      otpExp: {
        gte: new Date(),
      },
    },
    select: {
      token: true,
      otpExp: true,
      id: true,
    },
  });

  let validUser;

  for (const user of searchUser) {
    const isMatch = await bcrypt.compare(changePassword.token, user.token);

    if (isMatch) {
      validUser = user;
      break;
    }
  }

  if (!validUser) throw new responseError(401, "Token Invalid or expired");
  const encryptPassword = await bcrypt.hash(changePassword.password, 10);

  await prismaClient.user.update({
    where: {
      id: validUser.id,
    },
    data: {
      password: encryptPassword,
      otpExp: null,
      token: null,
    },
  });
};

// const activation_acc = ()

const refresh_activate = async (token) => {
  // email = validate(emailUserValidation, email);

  const user = await prismaClient.user.findUnique({
    where: {
      token: token,
    },
    select: {
      status: true,
      id: true,
      email: true,
    },
  });

  if (!user) throw new responseError(404, "token not found");
  const tokenActivate = crypto.randomBytes(32).toString("hex");
//   const linkExp = new Date(Date.now() + 60 * 60 * 1000);

  await sendLink(user.email, tokenActivate, "Verifikasi Akun Perpustakaan");

  return prismaClient.user.update({
    where: {
      id: user.id,
    },
    data: {
      token: tokenActivate,
      otpExp: linkExp,
    },
    select: {
      token: true,
    },
  });
};

const validate_activation = async (token) => {
  const user = await prismaClient.user.findFirst({
    where: { token },
    select: {
      id: true,
      status: true,
      email: true
    },
  });

  if (!user) throw new responseError(401, "Token tidak ditemukan");
//   if (user.otpExp.getTime() < Date.now()) throw new responseError(401, "Token expired");

  // hanya return user info — tidak update status di sini
  return user;
};

export default {
  register,
  validate_activation,
  verifyOTP,
  login,
  token,
  getUser,
  updateProfile,
  forgotPasswordCheckEmail,
  changePassword,
  refresh_activate,
};
