import { clientEntity } from "../models/client.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import "dotenv/config";
import { voucherEntity } from "../models/voucher.model.js";
import {orderEntity} from "../models/order.model.js";
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
