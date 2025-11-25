import { prismaClient } from "../application/database.js";
import userService from "../service/user-service.js";

const register = async (req, res, next) => {
  try {
    const result = await userService.register(req.body);
    // res.cookie("email" , result.email);
    res.status(200).json({
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

const otpValidation = async (req, res, next) => {
  try {
    const request = req.body;
    request.email = req.cookies.email;
    const result = await userService.verifyOTP(request);
    res.clearCookie("email");
    res.status(200).json({
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

const login = async (req, res, next) => {
  try {
    const request = req.body;

    const result = await userService.login(request);
    // res.cookie('accessToken' , result.token_access , {
    //     httpOnly : true,
    //     path : '/'
    // });
    res.cookie("refreshToken", result.token_refresh, {
      httpOnly: true,
      path: "/",
    });
    res.status(200).json({
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

const logout = (req, res, next) => {
  try {
    // res.clearCookie("accessToken" , {path : '/'});
    res.clearCookie("refreshToken", { path: "/" });

    res.status(200).json({
      data: "OK",
    });
  } catch (e) {
    next(e);
  }
};

const token = (req, res, next) => {
  try {
    const refresh_token = req.cookies.refreshToken;
    // const access_token = req.user.accessToken;

    const result = userService.token(refresh_token);
    // res.cookie('accessToken' , result.tokenAccess , {
    //     httpOnly : true,
    //     path : '/'
    // });
    res.cookie("refreshToken", result.tokenRefresh, {
      httpOnly: true,
      path: "/",
    });

    res.status(200).json({
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

const get = async (req, res, next) => {
  const email = req.user.email;
  const result = await userService.getUser(email);

  res.status(200).json({
    data: result,
  });
};

const updateProfile = async (req, res, next) => {
  try {
    const request = req.body;
    request.id = req.user.id;
    request.emailFirst = req.user.email;
    const result = await userService.updateProfile(request);
    // res.cookie("email" , req.user.email);

    // res.clearCookie("accessToken" , {path : '/'});
    // res.clearCookie("refreshToken", { path: "/" });

    res.status(200).json({
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

const forgotPasswordCheckEmail = async (req, res, next) => {
  try {
    const email = req.body;
    const result = await userService.forgotPasswordCheckEmail(email);
    res.status(200).json({
      data: "OK",
    });
  } catch (error) {
    next(error);
  }
};

const forgotPassword = async (req, res, next) => {
  try {
    const request = req.body;
    request.token = req.params.code;

    const result = await userService.changePassword(request);
    res.status(200).json({
      data: "OK",
    });
  } catch (e) {
    next(e);
  }
};

const refresh_activate = async (req, res, next) => {
  try {
    const token = req.query.code;
    const result = await userService.refresh_activate(token);
    res.status(200).json({
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

const validating_activation = async (req, res, next) => {
  try {
    const token = req.body.code || req.query.code;

    // Validasi token dari service
    const user = await userService.validate_activation(token);

    // Jika sudah verified sebelumnya
    if (user.status === "verified") {
      return res.status(200).json({
        status: "success",
        message: "Akun sudah aktif sebelumnya",
      });
    }

    // Jika belum verified → update di sini
    await prismaClient.user.update({
      where: { email: user.email },
      data: { status: "verified" },
    });

    return res.status(200).json({
      status: "success",
      message: "Akun berhasil diaktivasi",
    });
  } catch (e) {
    console.error("Error validating activation:", e.message);
    res.status(400).json({
      status: "failed",
      message: e.message || "Token tidak valid atau sudah kadaluarsa",
      data: null,
    });
  }
};

const deleteGraduatedUser = async(req,res,next)=>{
  try {
    const result = await userService.deleteUserWhoAlreadyGraduate();
    res.status(200).json({
      affectedUser : result
    })
    
  } catch (e) {
    next(e)   
  }
}

export default {
  validating_activation,
  get,
  refresh_activate,
  register,
  otpValidation,
  login,
  logout,
  token,
  updateProfile,
  forgotPasswordCheckEmail,
  forgotPassword,
  deleteGraduatedUser
};
