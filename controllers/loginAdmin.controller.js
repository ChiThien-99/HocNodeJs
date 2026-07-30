import { adminEntity } from "../models/admin.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import "dotenv/config";
import { verify} from "otplib";
export const getLoginAdmin = (req, res) => {
  res.render("loginAdmin.ejs");
};
export const postLoginAdmin = async (req, res) => {
  try {
    const { emailAdmin, pwAdmin } = req.body;
    const user = await adminEntity.findOne({ email: emailAdmin });
    if (!user || !(await bcrypt.compare(pwAdmin, user.password))) {
      return res
        .status(401)
        .json({ mess: "Sai thông tin đăng nhập", success: false });
    }
    res
      .status(200)
      .json({ idClient:user._id, success: true});
  } catch (error) {
    console.error(error);
    res.status(500).json({ mess: "Lỗi máy chủ nội bộ", success: false });
  }
};
export const checkOtpLoginAdmin = async (req, res) => {
  try {
    const { otp, adminId } = req.body;
    const admin = await adminEntity.findById(adminId);
    let isAuthorized = false;
    if (otp.length === 6 && !otp.includes("-")) {
      const result = await verify({ secret: admin.mfa.secret, token: otp });
      if (result.valid) {
        isAuthorized = true;
      }
    } else {
      for (let i = 0; i < admin.mfa.backupCodes.length; i++) {
        const match = await bcrypt.compare(otp, admin.mfa.backupCodes[i]);
        if (match) {
          isAuthorized = true;
          admin.mfa.backupCodes.splice(i, 1);
          await admin.save();
          break;
        }
      }
    }
    if (isAuthorized) {
      const accessToken = jwt.sign(
      {
        id: admin._id,
        email: admin.email,
        fullname: admin.fullname,
        role: admin.role,
        decent: admin.decent,
      },
      process.env.ACCESS_SECRET,
      { expiresIn: "15m" },
    );
    const refreshToken = jwt.sign(
      {
        id: admin._id,
      },
      process.env.REFRESH_SECRET,
      { expiresIn: "7d" },
    );
    await adminEntity.updateOne(
      { _id: admin._id },
      { $set: { refreshToken: refreshToken } },
    );
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: "none",
      path: "/",
    });
    res.cookie("accessToken", accessToken, {
      httpOnly: false,
      secure: true,
      sameSite: "none",
      path: "/",
    });
      res.json({
        mess: "Đăng nhập thành công",
        success: true,
        accessToken,
      });
    } else {
      res.json({
        mess: "Mã OTP/Mã dự phòng không chính xác hoặc đã hết hạn",
        success: false,
      });
    }
  } catch (error) {
    res.json({
      mess: "Lỗi máy chủ nội bộ",
      success: false,
      error: error.message,
    });
  }
};
