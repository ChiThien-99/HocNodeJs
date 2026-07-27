import { clientEntity } from "../models/client.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import "dotenv/config";
import { voucherEntity } from "../models/voucher.model.js";
import {orderEntity} from "../models/order.model.js";
import { generateSecret, generateURI, verify } from "otplib";
import QRCode from "qrcode";
export const getDashboardClient = async (req, res) => {
  const {idClient}=req.params;
  const vouchers = await voucherEntity
    .find({
      isActive: true,
      clientIds: { $in: [idClient] },
      usersUsed: { $nin: [idClient] },
    })
    .select("applyToCategory code image title content discountPercentage createdAt");
  const orders=await orderEntity.find({idClient:idClient});
  res.render("dashboardClient.ejs", { vouchers,orders });
};
export const putInfoClient = async (req, res) => {
  try {
    const { id } = req.params;
    let { fullname, dateBirth, tel, email, currentPw, newPw } = req.body;
    const client = await clientEntity.findById(id);
    console.log(client);
    console.log(id);
    if (currentPw && newPw) {
      if (!client || !(await bcrypt.compare(currentPw, client.password))) {
        return res
          .status(401)
          .json({ mess: "Sai mật khẩu hiện tại", success: false });
      }
      const salt = await bcrypt.genSalt(10);
      newPw = await bcrypt.hash(newPw, salt);
    } else {
      newPw = client.password;
    }

    const [day, month, year] = dateBirth.split("/");
    dateBirth = new Date(year, month - 1, day);
    const updateClient = await clientEntity.findByIdAndUpdate(
      id,
      {
        fullname: fullname,
        datebirth: dateBirth,
        tel: tel,
        email: email,
        password: newPw,
      },
      { new: true },
    );
    const accessToken = jwt.sign(
      {
        id: updateClient._id,
        fullname: updateClient.fullname,
        datebirth: updateClient.datebirth,
        tel: updateClient.tel,
        email: updateClient.email,
      },
      process.env.ACCESS_SECRET,
      { expiresIn: "15m" },
    );
    res.cookie("accessToken2", accessToken, {
      httpOnly: false,
      secure: true,
      sameSite: "none",
      path: "/",
    });
    res.json({ mess: "Cập nhật thành công", success: true, accessToken });
  } catch (error) {
    res.json({
      mess: "Cập nhật thất bại",
      success: false,
      error: error.message,
    });
  }
};
export const mfaSetup=async(req,res)=>{
  try {
  const idClient=req.user.id;
  const client=await clientEntity.findById(idClient);
  if (!client) {
    return res.json({mess:"Không tìm được client",success:false});
  }
  const secret=generateSecret();
  console.log(`Secret: ${secret}`);
  const otpAuth=generateURI({
    issuer:"VanHyTech",
    label:client.email,
    secret,
  });
  client.mfa.secret=secret;
  await client.save();
  const qrCodeImgUrl=await QRCode.toDataURL(otpAuth);
  return res.json({qrCode:qrCodeImgUrl,success:true});
  } catch (error) {
  return res.json({mess:"Kích hoạt MFA thất bại",success:false,error:error.message});
  }
}
export const enableMfa=async(req,res)=>{
  try {
  const {otpMfa}=req.body;
  const idClient=req.user.id;
  const client=await clientEntity.findById(idClient);
  if (!client) {
    return res.json({mess:"Không tìm được client",success:false});
  }
  const secret=client.mfa.secret;
  const otp=otpMfa;
  console.log(`otp:${otp}`);
  console.log(`otpMfa:${otpMfa}`);
  const result=verify({secret,otp});
  console.log(`result:${result}`);
  console.log(`resultValid:${result.valid}`);
  if (result.valid===false) {
    return res.json({mess:"Mã OTP không đúng hoặc đã hết hạn",success:false});
  }
  client.mfa.isEnabled=true;
  await client.save();
  return res.json({mess:"Kích hoạt xác thực 2 lớp thành công",success:true});
  } catch (error) {
  return res.json({mess:"Kích hoạt xác thực thất bại",success:false,error:error.message});
  }
}