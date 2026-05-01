import { adminEntity } from "../models/admin.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import "dotenv/config";
export const getLoginAdmin = (req, res) => {
  res.render("loginAdmin.ejs");
};
export const postLoginAdmin = async (req, res) => {
  const { emailAdmin, pwAdmin } = req.body;
  const user = await adminEntity.findOne({ email: emailAdmin });
  const isMatch = await bcrypt.compare(pwAdmin, user.password);
  if (!user || !isMatch) {
    res.json({ mess: "Sai thông tin đăng nhập" });
  }
  const token = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "15m" },
  );
  res.json({ mess: "Đăng nhập thành công", status: 200, token });
};
