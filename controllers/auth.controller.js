import { adminEntity } from "../models/admin.model.js";
import { clientEntity } from "../models/client.model.js";
import jwt from "jsonwebtoken";
import logger from "../config/logger.js";
export const authTokens = async (req, res) => {
  const oldRefreshToken = req.cookies.refreshToken;
  if (!oldRefreshToken) {
    return res.status(401).json("Chưa đăng nhập");
  }
  const admin = await adminEntity.findOne({ refreshToken: oldRefreshToken });
  if (!admin) {
    return res.status(403).json("Refresh Token không hợp lệ hoặc đã sử dụng");
  }
  jwt.verify(
    oldRefreshToken,
    process.env.REFRESH_SECRET,
    async (err, decodes) => {
      if (err) {
        await adminEntity.updateOne(
          { _id: admin._id },
          { $pull: { refreshToken: oldRefreshToken } },
        );
        return res.status(403).json("Token đã hết hạn hoặc sai");
      }
      const newAccessToken = jwt.sign(
        {
          id: admin._id,
          fullname: admin.fullname,
          role: admin.role,
          email: admin.email,
          decent: admin.decent,
        },
        process.env.ACCESS_SECRET,
        { expiresIn: "15m" },
      );
      console.log(`newAccessToken: ${newAccessToken}`);
      const newRefreshToken = jwt.sign(
        { id: admin._id },
        process.env.REFRESH_SECRET,
        { expiresIn: "7d" },
      );
      console.log(`newRefreshToken: ${newRefreshToken}`);
      await adminEntity.updateOne(
        { _id: admin._id, refreshToken: oldRefreshToken },
        { $set: { "refreshToken.$": newRefreshToken } },
      );
      res.cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        path: "/",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      res.json({ accessToken: newAccessToken });
    },
  );
};
export const getme = async (req, res) => {
  try {
    const adminId = req.user.id;
    const admin = await adminEntity.findById(adminId).select("-password");
    if (!admin) {
      return res.status(404).json({
        success: false,
        mess: "Không tìm thấy người dùng",
      });
    }
    res.status(200).json({
      success: true,
      data: admin,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      mess: "Lỗi máy chủ",
      error: error.message,
    });
  }
};
// export const authTokens2 = async (req, res) => {
//   const oldRefreshToken = req.cookies.refreshToken2;
//   if (!oldRefreshToken) {
//     return res.status(401).json("Chưa đăng nhập");
//   }
//   const client = await clientEntity.findOne({ refreshToken: oldRefreshToken });
//   if (!client) {
//     return res.status(403).json("Refresh Token không hợp lệ hoặc đã sử dụng");
//   }
//   jwt.verify(
//     oldRefreshToken,
//     process.env.REFRESH_SECRET,
//     async (err, decodes) => {
//       if (err) {
//         await clientEntity.updateOne(
//           { _id: client._id },
//           { $pull: { refreshToken: oldRefreshToken } },
//         );
//         return res.status(403).json("Token đã hết hạn hoặc sai");
//       }
//       const newAccessToken = jwt.sign(
//         {
//           id: client._id,
//           fullname: client.fullname,
//           datebirth: client.datebirth,
//           tel: client.tel,
//           email: client.email,
//         },
//         process.env.ACCESS_SECRET,
//         { expiresIn: "15m" },
//       );
//       console.log(`newAccessToken: ${newAccessToken}`);
//       const newRefreshToken = jwt.sign(
//         { id: client._id },
//         process.env.REFRESH_SECRET,
//         { expiresIn: "7d" },
//       );
//       console.log(`newRefreshToken: ${newRefreshToken}`);
//       await clientEntity.updateOne(
//         { _id: client._id, refreshToken: oldRefreshToken },
//         { $set: { "refreshToken.$": newRefreshToken } },
//       );
//       res.cookie("refreshToken2", newRefreshToken, {
//         httpOnly: true,
//         secure: true,
//         sameSite: "none",
//         path: "/",
//         maxAge: 7 * 24 * 60 * 60 * 1000,
//       });
//       res.json({ accessToken: newAccessToken });
//     },
//   );
// };
export const authTokens2 = async (req, res) => {
  try {
    const oldRefreshToken = req.cookies.refreshToken2;
    if (!oldRefreshToken) {
      return res.status(401).json("Chưa đăng nhập");
    }

    const client = await clientEntity.findOne({
      refreshToken: oldRefreshToken,
    });
    if (!client) {
      return res.status(403).json("Refresh Token không hợp lệ hoặc đã sử dụng");
    }

    // CHUYỂN SANG DÙNG TRY/CATCH ĐỂ XỬ LÝ ĐỒNG BỘ JWT VERIFY
    try {
      const decodes = jwt.verify(oldRefreshToken, process.env.REFRESH_SECRET);

      // Nếu token hợp lệ, tiến hành tạo cặp token mới
      const newAccessToken = jwt.sign(
        {
          id: client._id,
          fullname: client.fullname,
          datebirth: client.datebirth,
          tel: client.tel,
          email: client.email,
        },
        process.env.ACCESS_SECRET,
        { expiresIn: "15m" }, // Thời gian sống an toàn cho Access Token
      );

      const newRefreshToken = jwt.sign(
        { id: client._id },
        process.env.REFRESH_SECRET,
        { expiresIn: "7d" },
      );

      // Cập nhật Refresh Token mới vào mảng trong Database
      await clientEntity.updateOne(
        { _id: client._id, refreshToken: oldRefreshToken },
        { $set: { "refreshToken.$": newRefreshToken } },
      );

      // Cấu hình lưu trữ Refresh Token mới vào Cookie
      res.cookie("refreshToken2", newRefreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        path: "/",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return res.json({ accessToken: newAccessToken });
    } catch (jwtError) {
      // Bắt lỗi nếu Refresh Token bị hết hạn hoặc sai chữ ký
      await clientEntity.updateOne(
        { _id: client._id },
        { $pull: { refreshToken: oldRefreshToken } },
      );
      return res.status(403).json("Token đã hết hạn hoặc sai");
    }
  } catch (error) {
    return res.status(500).json({ mess: "Lỗi hệ thống", error: error.message });
  }
};
export const getme2 = async (req, res) => {
  try {
    const clientId = req.user.id;
    const client = await clientEntity.findById(clientId).select("-password");
    if (!client) {
      return res.status(404).json({
        success: false,
        mess: "Không tìm thấy người dùng",
      });
    }
    res.status(200).json({
      success: true,
      data: client,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      mess: "Lỗi máy chủ",
      error: error.message,
    });
  }
};
export const logout = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken2;
    if (!refreshToken) {
      return res.json({ mess: "Đã đăng xuất", success: true });
    }
    await clientEntity.updateOne(
      { refreshToken: refreshToken },
      { $pull: { refreshToken: refreshToken } },
    );
    res.clearCookie("refreshToken2", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/",
    });
    return res.json({ mess: "Đã đăng xuất", success: true });
  } catch (error) {
    return res.json({
      mess: "Đăng xuất thất bại",
      success: false,
      error: error.message,
    });
  }
};
export const logoutDB = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!req.user) {
      return res.json({
        mess: "Không tìm thấy tài khoản admin\nVui lòng đăng nhập",
        success: false,
      });
    }
    if (!refreshToken) {
      return res.json({ mess: "Đã đăng xuất", success: true });
    }
    await clientEntity.updateOne(
      { refreshToken: refreshToken },
      { $pull: { refreshToken: refreshToken } },
    );
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/",
    });
    logger.info(`${req.user.email} đã đăng xuất`);
    return res.json({ mess: "Đã đăng xuất", success: true });
  } catch (error) {
    logger.error(`${req.user.email} đăng xuất thất bại.Lỗi:${error.message}`);
    return res.json({
      mess: "Đăng xuất thất bại",
      success: false,
      error: error.message,
    });
  }
};
