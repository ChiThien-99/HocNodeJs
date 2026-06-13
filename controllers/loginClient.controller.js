import { clientEntity } from "../models/client.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import "dotenv/config";
export const postClient = async (req, res) => {
  try {
    let {
      fullNameClient,
      dateBirthClient,
      telClient,
      emailClient,
      pwClient,
      pwReClient,
    } = req.body;
    if (pwClient !== pwReClient) {
      return res.json({
        mess: "Mật khẩu nhập lại không chính xác",
        success: false,
      });
    }
    const salt = await bcrypt.genSalt(10);
    pwClient = await bcrypt.hash(pwClient, salt);
    if (!telClient) {
      telClient = 0;
    }
    const [day,month,year]=dateBirthClient.split("/");
    dateBirthClient=new Date(year,month-1,day);
    await clientEntity.create({
      fullname: fullNameClient,
      datebirth: dateBirthClient,
      tel: telClient,
      email: emailClient,
      password: pwClient,
    });
    res.json({
      mess: `Tạo tài khoản thành viên thành công\nĐã chuyển qua tab đăng nhập`,
      success: true,
    });
  } catch (error) {
    res.json({
      mess: "Tạo tài khoản thành viên thất bại",
      success: false,
      error: error.message,
    });
  }
};
export const loginClient = async (req, res) => {
  try {
    const { emailClient2, pwClient2,rememberMe } = req.body;
    const client = await clientEntity.findOne({ email: emailClient2 });
    if (!client || !(await bcrypt.compare(pwClient2, client.password))) {
      return res
        .status(401)
        .json({ mess: "Sai thông tin đăng nhập", success: false });
    }
    console.log(rememberMe);
    const cookieMaxAge=rememberMe===true?30*24*60*60*1000:0;
    console.log(cookieMaxAge);
    const accessToken = jwt.sign(
      {
        id: client._id,
        fullname: client.fullname,
        datebirth: client.datebirth,
        tel: client.tel,
        email: client.email,
      },
      process.env.ACCESS_SECRET,
      { expiresIn: "15m" },
    );
    const refreshToken = jwt.sign(
      {
        id: client._id,
      },
      process.env.REFRESH_SECRET,
      { expiresIn: "7d" },
    );
    await clientEntity.updateOne(
      { _id: client._id },
      { $set: { refreshToken: refreshToken } },
    );
    res.cookie("refreshToken2", refreshToken, {
      httpOnly: true,
      secure: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: "none",
      path: "/",
    });
    res.cookie("accessToken2", accessToken, {
      httpOnly: false,
      secure: true,
      maxAge:cookieMaxAge,
      sameSite: "none",
      path: "/",
    });
    res
      .status(200)
      .json({ mess: "Đăng nhập thành công", success: true, accessToken,cookieMaxAge });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mess: "Lỗi máy chủ nội bộ", success: false });
  }
};
