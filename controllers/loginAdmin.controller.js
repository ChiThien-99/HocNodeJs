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
    if (!user || !(await bcrypt.compare(pwAdmin, user.password))) {
      return res
        .status(401)
        .json({ mess: "Sai thông tin đăng nhập", success: false });
    }
    const token = jwt.sign(
      { id:user._id,email: user.email, fullname:user.fullname, role: user.role, decent:user.decent },
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
    );
    res.cookie("refreshToken", token, {
      httpOnly: true,
      secure: true,
      maxAge: 7*24*60*60*1000,
      sameSite: "none",
      path:"/",
    });
    res
      .status(200)
      .json({ mess: "Đăng nhập thành công", success: true, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mess: "Lỗi máy chủ nội bộ", success: false });
  }
};
