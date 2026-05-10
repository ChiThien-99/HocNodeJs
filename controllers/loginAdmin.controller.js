import { adminEntity } from "../models/admin.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import "dotenv/config";
export const getLoginAdmin = (req, res) => {
  res.render("loginAdmin.ejs");
};
export const postLoginAdmin = async (req, res) => {
  try {
    const { emailAdmin, pwAdmin } = req.body;
    const user = await adminEntity.findOne({ email: emailAdmin });
    console.log(user.password);
    if (!user || !(await bcrypt.compare(pwAdmin, user.password))) {
      return res
        .status(401)
        .json({ mess: "Sai thông tin đăng nhập", success: false });
    }
    const accessToken = jwt.sign(
      {
        id: user._id,
        email: user.email,
        fullname: user.fullname,
        role: user.role,
        decent: user.decent,
      },
      process.env.ACCESS_SECRET,
      { expiresIn: "15m" },
    );
    const refreshToken = jwt.sign(
      {
        id: user._id,
      },
      process.env.REFRESH_SECRET,
      { expiresIn: "7d" },
    );
    await adminEntity.updateOne(
      { _id: user._id },
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
      maxAge: 15 * 60 * 60 * 1000,
      sameSite: "none",
      path: "/",
    });
    res
      .status(200)
      .json({ mess: "Đăng nhập thành công", success: true, accessToken });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mess: "Lỗi máy chủ nội bộ", success: false });
  }
};
