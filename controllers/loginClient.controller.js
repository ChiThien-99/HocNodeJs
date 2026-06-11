import { clientEntity } from "../models/client.model.js";
import bcrypt from "bcryptjs";
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
