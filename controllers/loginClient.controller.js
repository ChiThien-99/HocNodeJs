import { clientEntity } from "../models/client.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import "dotenv/config";
import { sendVerificationEmail,sendReqDisableMfaEmail } from "../services/email.service.js";
import { verify, verifySync } from "otplib";
export const postClient = async (req, res) => {
  try {
    let {
      fullNameClient,
      dateBirthClient,
      genderClient,
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
    if (emailClient) {
      emailClient = emailClient.trim().toLowerCase();
    }
    const [day, month, year] = dateBirthClient.split("/");
    dateBirthClient = new Date(year, month - 1, day);
    fullNameClient = fullNameClient.toUpperCase();
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpired = new Date(Date.now() + 5 * 60 * 1000);
    await clientEntity.create({
      fullname: fullNameClient,
      datebirth: dateBirthClient,
      gender: genderClient,
      tel: telClient,
      email: emailClient,
      password: pwClient,
      otpCode: otp,
      otpExpired: otpExpired,
      isVerified: false,
    });
    const emailSend = await sendVerificationEmail(
      emailClient,
      fullNameClient,
      otp,
    );
    res.json({
      mess: `Tạo tài khoản thành viên thành công`,
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
export const checkOtp = async (req, res) => {
  try {
    let { email, otpCode } = req.body;
    console.log(email);
    if (email) {
      email = email.trim().toLowerCase();
    }
    const client = await clientEntity.findOne({ email: email });
    if (!client) {
      return res.json({ mess: "Không tìm thấy tài khoản", success: false });
    }
    if (client.otpCode !== otpCode || client.otpExpired < new Date()) {
      return res.json({ mess: "Mã OTP sai hoặc đã hết hạn", success: false });
    }
    client.isVerified = true;
    client.otpCode = undefined;
    client.otpExpired = undefined;
    await client.save();
    res.json({
      mess: "Kích hoạt tài khoản thành công\nĐã chuyển sang tab đăng nhập",
      success: true,
    });
  } catch (error) {
    res.json({
      mess: "Kích hoạt tài khoản thất bại",
      success: false,
      error: error.message,
    });
  }
};
export const resendOtp = async (req, res) => {
  try {
    let { email } = req.body;
    if (!email) {
      return res.json({ mess: "Không tìm thấy email", success: false });
    }
    email = email.trim().toLowerCase();
    const client = await clientEntity.findOne({ email: email });
    if (!client) {
      return res.json({
        mess: "Không tìm thấy client từ email",
        success: false,
      });
    }
    const fullnameClient = client.fullname;
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpired = new Date(Date.now() + 5 * 60 * 1000);
    client.otpCode = otp;
    client.otpExpired = otpExpired;
    await client.save();
    const emailSend = await sendVerificationEmail(email, fullnameClient, otp);
    res.json({ mess: "Mã OTP đã được gửi lại qua mail", success: true });
  } catch (error) {
    res.json({
      mess: "Mã OTP gửi lại thất bại",
      success: false,
      error: error.message,
    });
  }
};
export const loginClient = async (req, res) => {
  try {
    const { emailClient2, pwClient2, rememberMe } = req.body;
    const client = await clientEntity.findOne({ email: emailClient2 });
    if (!client || !(await bcrypt.compare(pwClient2, client.password))) {
      return res
        .status(401)
        .json({ mess: "Sai thông tin đăng nhập", success: false });
    }
    if (client.mfa.isEnabled) {
      return res.json({
        requiredMfa: true,
        clientId: client._id,
        success: true,
      });
    }
    console.log(rememberMe);
    const cookieMaxAge = rememberMe === true ? 30 * 24 * 60 * 60 * 1000 : 0;
    console.log(cookieMaxAge);
    const accessToken = jwt.sign(
      {
        id: client._id,
        fullname: client.fullname,
        datebirth: client.datebirth,
        tel: client.tel,
        email: client.email,
        mfa: client.mfa,
      },
      process.env.ACCESS_SECRET,
      { expiresIn: "8h" },
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
      maxAge: cookieMaxAge,
      sameSite: "none",
      path: "/",
    });
    res.json({
      mess: "Đăng nhập thành công",
      success: true,
      accessToken,
      cookieMaxAge,
    });
  } catch (error) {
    res.json({
      mess: "Lỗi máy chủ nội bộ",
      success: false,
      error: error.message,
    });
  }
};
export const checkOtpLogin = async (req, res) => {
  try {
    const { otp, clientIdRemember } = req.body;
    const arrayIdRemember = clientIdRemember.split(",");
    const client = await clientEntity.findById(arrayIdRemember[0]);
    let isAuthorized = false;
    if (otp.length === 6 && !otp.includes("-")) {
      const result = await verify({ secret: client.mfa.secret, token: otp });
      if (result.valid) {
        isAuthorized = true;
      }
    } else {
      for (let i = 0; i < client.mfa.backupCodes.length; i++) {
        const match = await bcrypt.compare(otp, client.mfa.backupCodes[i]);
        if (match) {
          isAuthorized = true;
          client.mfa.backupCodes.splice(i, 1);
          await client.save();
          break;
        }
      }
    }
    if (isAuthorized) {
      const cookieMaxAge =
        arrayIdRemember[1] === true ? 30 * 24 * 60 * 60 * 1000 : 0;
      const accessToken = jwt.sign(
        {
          id: client._id,
          fullname: client.fullname,
          datebirth: client.datebirth,
          tel: client.tel,
          email: client.email,
          mfa: client.mfa,
        },
        process.env.ACCESS_SECRET,
        { expiresIn: "8h" },
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
        maxAge: cookieMaxAge,
        sameSite: "none",
        path: "/",
      });
      res.json({
        mess: "Đăng nhập thành công",
        success: true,
        accessToken,
        cookieMaxAge,
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
export const checkMailForgotPW = async (req, res) => {
  try {
    let { emailForgotPass } = req.body;
    if (!emailForgotPass) {
      return res.json({
        mess: "Vui lòng điền email để lấy lại mật khẩu",
        success: false,
      });
    }
    emailForgotPass = emailForgotPass.trim().toLowerCase();
    const client = await clientEntity.findOne({ email: emailForgotPass });
    if (!client) {
      return res.json({ mess: "Email chưa được đăng ký", success: false });
    }
    const fullnameClient = client.fullname;
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpired = new Date(Date.now() + 5 * 60 * 1000);
    client.otpCode = otp;
    client.otpExpired = otpExpired;
    await client.save();
    const emailSend = await sendVerificationEmail(
      emailForgotPass,
      fullnameClient,
      otp,
    );
    res.json({ mess: "Điền mã OTP được gửi về email của bạn", success: true });
  } catch (error) {
    res.json({ mess: "Có lỗi xảy ra", success: false, error: error.message });
  }
};
export const checkOtpForgotPW = async (req, res) => {
  try {
    let { emailForgotPass, otpCode } = req.body;
    if (emailForgotPass) {
      emailForgotPass = emailForgotPass.trim().toLowerCase();
    }
    const client = await clientEntity.findOne({ email: emailForgotPass });
    if (!client) {
      return res.json({ mess: "Không tìm thấy tài khoản", success: false });
    }
    if (client.otpCode !== otpCode || client.otpExpired < new Date()) {
      return res.json({ mess: "Mã OTP sai hoặc đã hết hạn", success: false });
    }
    client.isVerified = true;
    client.otpCode = undefined;
    client.otpExpired = undefined;
    await client.save();
    res.json({
      mess: "Nhập mật khẩu mới của bạn",
      success: true,
    });
  } catch (error) {
    res.json({
      mess: "Có lỗi xảy ra",
      success: false,
      error: error.message,
    });
  }
};
export const changeForgotPW = async (req, res) => {
  try {
    let { emailForgotPass, newPass } = req.body;
    if (emailForgotPass) {
      emailForgotPass = emailForgotPass.trim().toLowerCase();
    }
    const client = await clientEntity.findOne({ email: emailForgotPass });
    if (!client) {
      return res.json({ mess: "Không tìm thấy tài khoản", success: false });
    }
    const salt = await bcrypt.genSalt(10);
    newPass = await bcrypt.hash(newPass, salt);
    client.password = newPass;
    client.save();
    res.json({
      mess: "Tạo mật khẩu mới thành công\nĐã chuyển qua form đăng nhập",
      success: true,
    });
  } catch (error) {
    res.json({
      mess: "Tạo mật khẩu mới thất bại",
      success: false,
      error: error.message,
    });
  }
};
export const sendMailDisableMFA=async(req,res)=>{
  try {
  const {clientIdRemember}=req.body;
  const arrayIdRemember=clientIdRemember.split(",");
  const client=await clientEntity.findById(arrayIdRemember[0]);
  if (!client) {
    return res.json({mess:"Không tìm thấy client",success:false});
  }
  const disableToken=jwt.sign({clientId:client._id},process.env.JWT_MFA_SECRET,{expiresIn:"15m"});
  await sendReqDisableMfaEmail(client.email,client.fullname,disableToken);
  res.json({mess:"Kiểm tra email để tắt xác thực bạn nhé!",success:true});
  } catch (error) {
  res.json({mess:"Có lỗi gửi mail tắt xác thực",success:false,error:error.message});
  }
};
export const verifyDisableLink=async(req,res)=>{
  try {
    const {token}=req.query;
    if (!token) {
        return res.render("disableMFAClient.ejs",{mess:"Đường dẫn không hợp lệ",success:false});
    }
    const decoded=jwt.verify(token,process.env.JWT_MFA_SECRET);
    const clientId=decoded.clientId;
    const client=await clientEntity.findById(clientId);
    client.mfa.isEnabled=false;
    client.mfa.secret=null;
    client.mfa.backupCodes=[];
    await client.save();
    res.render("disableMFAClient.ejs",{mess:"Tài khoản đã tắt xác thực 2 lớp",success:true});
  } catch (error) {
    res.render("disableMFAClient.ejs",{mess:"Lỗi tắt xác thực 2 lớp",success:false});
  }
}
