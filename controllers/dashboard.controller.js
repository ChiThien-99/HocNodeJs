import os from "os";
import { json } from "stream/consumers";
import { adminEntity } from "../models/admin.model.js";
import { bannerEntity } from "../models/banner.model.js";
import { notifyEntity } from "../models/notification.model.js";
import { funcAppEntity } from "../models/funcApp.model.js";
import { appEntity } from "../models/app.model.js";
import { v2 as cloudinary } from "cloudinary";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
function getSystemInfo() {
  const info = {
    os: {
      type: os.type(),
      platform: os.platform(),
      architecture: os.arch(),
      release: os.release(),
      hostname: os.hostname(),
      uptime: formatUptime(os.uptime()),
    },
    user: {
      username: os.userInfo().username,
      homedir: os.homedir(),
      tempdir: os.tmpdir(),
    },
    memory: {
      total: formatByte(os.totalmem()),
      free: formatByte(os.freemem()),
      usage: `${((1 - os.freemem() / os.totalmem()) * 100).toFixed(2)}%`,
    },
    cpu: {
      model: os.cpus()[0].model,
      cores: os.cpus().length,
      speed: `${os.cpus()[0].speed} Mhz`,
    },
  };
  return info;
}
function formatUptime(seconds) {
  const days = Math.floor(seconds / (60 * 60 * 24));
  const hours = Math.floor((seconds % (60 * 60 * 24)) / (60 * 60));
  const minutes = Math.floor((seconds % (60 * 60)) / 60);
  const secs = Math.floor(seconds % 60);
  return `${days}d ${hours}h ${minutes}m ${secs}s`;
}
function formatByte(bytes) {
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  if (bytes === 0) return "o Bytes";
  const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
  return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
}
const systemInfo = getSystemInfo();
const jsonSystemInfo = JSON.stringify(systemInfo, null, 2);

export const getDashboard = async (req, res) => {
  const admins = await adminEntity.find();
  const banners = await bannerEntity.find().sort("order");
  const notifys = await notifyEntity.find().sort("-createAt");
  const listFuncApp = await funcAppEntity.find();
  const apps=await appEntity.find().sort("-createAt");
  const io = req.app.get("socketio");
  io.on("connection", async (socket) => {
    const allNotify = await notifyEntity.find().sort("-createAt");
    socket.emit("update-notify", allNotify);
  });
  res.render("dashboard.ejs", {
    jsonSystemInfo,
    admins,
    banners,
    notifys,
    listFuncApp,
    apps,
  });
};
export const postRegisterAdmin = async (req, res) => {
  try {
    let { fullnameAdmin, roleAdmin, emailAdmin, pwAdmin, valueDecentAdmin } =
      req.body;
    const salt = await bcrypt.genSalt(10);
    pwAdmin = await bcrypt.hash(pwAdmin, salt);
    let registerAdmin = new adminEntity({
      fullname: fullnameAdmin,
      role: roleAdmin,
      email: emailAdmin,
      password: pwAdmin,
      decent: valueDecentAdmin,
    });
    registerAdmin.save();
    res.json({ mess: "Đăng ký tài khoản admin thành công", success: true });
  } catch (error) {
    res.json({
      mess: "Đăng ký tài khoản admin thất bại",
      success: false,
      err: error.message,
    });
  }
};
export const getUserAdminById = async (req, res) => {
  try {
    const { id } = req.params;
    const admin = await adminEntity.findById(id);
    res.json({ data: admin, success: true });
  } catch (error) {
    res.json({ success: false, error: error.message });
  }
};

export const putUpdateAdminById = async (req, res) => {
  try {
    const { idUpdate } = req.params;
    const idUserCurrent = req.user.id;
    const roleUserCurrent = req.user.role;
    let { fullnameAdmin, roleAdmin, emailAdmin, pwAdmin, valueDecentAdmin } =
      req.body;
    const salt = await bcrypt.genSalt(10);
    pwAdmin = await bcrypt.hash(pwAdmin, salt);
    console.log(`${idUpdate},${idUserCurrent},${roleUserCurrent}`);
    if (idUpdate !== idUserCurrent && roleUserCurrent !== "Tổng giám đốc") {
      return res.status(403).json({
        mess: "Bạn không đủ quyền thực hiện hành động này!",
        success: false,
      });
    }
    const updateAdmin = await adminEntity.findByIdAndUpdate(idUpdate, {
      fullname: fullnameAdmin,
      role: roleAdmin,
      email: emailAdmin,
      password: pwAdmin,
      decent: valueDecentAdmin,
    });
    console.log(`updateAdmin: ${updateAdmin}`);
    const accessToken = jwt.sign(
      {
        id: updateAdmin._id,
        email: updateAdmin.email,
        fullname: updateAdmin.fullname,
        role: updateAdmin.role,
        decent: updateAdmin.decent,
      },
      process.env.ACCESS_SECRET,
      { expiresIn: "15m" },
    );
    res.json({
      mess: "Cập nhật thành công",
      success: true,
      accessToken: accessToken,
      id: updateAdmin._id,
    });
  } catch (error) {
    res.json({
      mess: "Cập nhật thất bại",
      success: false,
      error: error.message,
    });
  }
};
export const putUpdatePWAdmin = async (req, res) => {
  try {
    const { idUpdate } = req.params;
    const idUserCurrent = req.user.id;
    let { valuePwAdminNew } = req.body;
    if (idUpdate != idUserCurrent) {
      return res.status(403).json({
        mess: "Bạn không đủ quyền thực hiện hành động này!",
        success: false,
      });
    }
    const salt = await bcrypt.genSalt(10);
    valuePwAdminNew = await bcrypt.hash(valuePwAdminNew, salt);
    const updatePWAdmin = await adminEntity.findByIdAndUpdate(idUpdate, {
      password: valuePwAdminNew,
    });
    console.log(`${updatePWAdmin}`);
    res.json({ mess: "Cập nhật mật khẩu thành công", success: true });
  } catch (error) {
    res.json({
      mess: "Cập nhật mật khẩu thất bại",
      success: false,
      error: error.message,
    });
  }
};
export const deleteUserAdminById = async (req, res) => {
  try {
    const { idDelete } = req.params;
    const idUserCurrent = req.user.id;
    const roleUserCurrent = req.user.role;
    if (idDelete != idUserCurrent && roleUserCurrent != "Tổng giám đốc") {
      return res.status(403).json({
        mess: "Bạn không đủ quyền thực hiện hành động này!",
        success: false,
      });
    }
    const deleteUserAdmin = await adminEntity.findByIdAndDelete(idDelete);
    res.json({ mess: "Xóa user thành công", success: true });
  } catch (error) {
    res.json({
      mess: "Xóa user thất bại",
      success: false,
      error: error.message,
    });
  }
};
export const postBanner = async (req, res) => {
  try {
    const { captionBanner, urlBanner, orderBanner } = req.body;
    const newBanner = await bannerEntity.create({
      caption: captionBanner,
      url: urlBanner,
      order: orderBanner,
      image: req.file.path,
      cloudinary_id: req.file.filename,
    });
    const io = req.app.get("socketio");
    const allBanner = await bannerEntity.find().sort("order");
    io.emit("update-carousel", allBanner);
    res.json({ mess: "Tạo banner thành công", success: "true" });
  } catch (error) {
    res.json({
      mess: "Tạo banner thất bại",
      success: false,
      error: error.message,
    });
  }
};
export const getBannerById = async (req, res) => {
  try {
    const { id } = req.params;
    const banner = await bannerEntity.findById(id);
    res.json({ banner: banner });
  } catch (error) {
    console.error(error.message);
  }
};
export const putUpdateBanner = async (req, res) => {
  try {
    const { id } = req.params;
    const { captionBanner, urlBanner, orderBanner } = req.body;
    const updateBanner = await bannerEntity.findByIdAndUpdate(id, {
      caption: captionBanner,
      url: urlBanner,
      order: orderBanner,
    });
    const io = req.app.get("socketio");
    const allBanner = await bannerEntity.find().sort("order");
    io.emit("update-carousel", allBanner);
    res.json({ mess: "Cập nhật thành công", success: true });
  } catch (error) {
    res.json({
      mess: "Cập nhật thất bại",
      success: false,
      error: error.message,
    });
  }
};
export const deleteBanner = async (req, res) => {
  try {
    const { id } = req.params;
    const banner = await bannerEntity.findById(id);
    if (!banner) {
      res.json({ mess: "Không tìm thấy banner", success: false });
    }
    await cloudinary.uploader.destroy(banner.cloudinary_id);
    await bannerEntity.findByIdAndDelete(id);
    const io = req.app.get("socketio");
    const allBanner = await bannerEntity.find().sort("order");
    io.emit("update-carousel", allBanner);
    res.json({ mess: "Xóa banner thành công", success: true });
  } catch (error) {
    res.json({
      mess: "Xóa banner thất bại",
      success: false,
      error: error.message,
    });
  }
};
export const addNotify = async (req, res) => {
  try {
    console.log(req.body);
    const { typeNotify, contentNotify, urlNotify, expiredNotify } = req.body;
    const expiredDate = new Date(expiredNotify);
    if (isNaN(expiredDate.getTime())) {
      return res.json({
        mess: "Vui lòng điền thời gian hết hạn",
        success: false,
      });
    }
    if (expiredDate <= new Date()) {
      return res.json({
        mess: "Thời gian hết hạn phải là thời gian trong tương lai",
        success: false,
      });
    }
    const newNotify = await notifyEntity.create({
      content: contentNotify,
      type: typeNotify,
      url: urlNotify,
      expireAt: expiredDate,
    });
    const io = req.app.get("socketio");
    const allNotify = await notifyEntity.find().sort("-createAt");
    io.emit("update-notify", allNotify);
    const delay = expiredDate.getTime() - Date.now();
    console.log(delay);
    setTimeout(async () => {
      const allNotify = await notifyEntity.find().sort("-createAt");
      io.emit("update-notify", allNotify);
      console.log("Đã cập nhật lại thông báo");
    }, delay + 180000);
    res.json({ mess: "Tạo thông báo thành công", success: true });
  } catch (error) {
    res.json({
      mess: "Tạo thông báo thất bại",
      success: false,
      error: error.message,
    });
  }
};
export const getUpdateNotify = async (req, res) => {
  try {
    const { id } = req.params;
    const notify = await notifyEntity.findById(id);
    res.json({ data: notify });
  } catch (error) {
    console.error("Không lấy được notify");
  }
};
export const putUpdateNotify = async (req, res) => {
  try {
    const { typeNotify, contentNotify, urlNotify, expiredNotify } = req.body;
    const { id } = req.params;
    const expiredDate = new Date(expiredNotify);
    if (isNaN(expiredDate.getTime())) {
      return res.json({
        mess: "Vui lòng điền thời gian hết hạn",
        success: false,
      });
    }
    if (expiredDate <= new Date()) {
      return res.json({
        mess: "Thời gian hết hạn phải là thời gian trong tương lai",
        success: false,
      });
    }
    const updateNotify = await notifyEntity.findByIdAndUpdate(id, {
      type: typeNotify,
      content: contentNotify,
      url: urlNotify,
      expireAt: expiredDate,
    });
    const io = req.app.get("socketio");
    const allNotify = await notifyEntity.find().sort("-createAt");
    io.emit("update-notify", allNotify);
    const delay = expiredDate.getTime() - Date.now();
    console.log(delay);
    setTimeout(async () => {
      const allNotify = await notifyEntity.find().sort("-createAt");
      io.emit("update-notify", allNotify);
    }, delay + 180000);
    res.json({ mess: "Cập nhật thông báo thành công", success: true });
  } catch (error) {
    res.json({
      mess: "Cập nhật thông báo thất bại",
      success: false,
      error: error.message,
    });
  }
};
export const deleteNotify = async (req, res) => {
  try {
    const { id } = req.params;
    const delNotify = await notifyEntity.findByIdAndDelete(id);
    const io = req.app.get("socketio");
    const allNotify = await notifyEntity.find().sort("-createAt");
    io.emit("update-notify", allNotify);
    res.json({ mess: "Xóa thông báo thành công", success: true });
  } catch (error) {
    res.json({
      mess: "Xóa thông báo thất bại",
      success: false,
      error: error.message,
    });
  }
};
export const addListFuncApp = async (req, res) => {
  try {
    const { listFuncApp } = req.body;
    const newFuncApp = await funcAppEntity.create({ name: listFuncApp });
    res.json({ mess: "Chức năng phần mềm tạo thành công", success: true });
  } catch (error) {
    res.json({
      mess: "Chức năng phần mềm tạo thất bại",
      success: false,
      error: error.message,
    });
  }
};
export const getupdateFuncApp = async (req, res) => {
  try {
    const { id } = req.params;
    const funcApp = await funcAppEntity.findById(id);
    res.json({ data: funcApp });
  } catch (error) {
    console.error("Lỗi khi lấy funcapp từ id");
  }
};
export const putUpdateFuncApp = async (req, res) => {
  try {
    const { id } = req.params;
    const { listFuncApp } = req.body;
    const updateFuncApp = await funcAppEntity.findByIdAndUpdate(id, {
      name: listFuncApp,
    });
    res.json({ mess: "Cập nhật chức năng phần mềm thành công", success: true });
  } catch (error) {
    res.json({
      mess: "Cập nhật chức năng phần mềm thất bại",
      success: false,
      error: error.message,
    });
  }
};
export const deleteFuncApp = async (req, res) => {
  try {
    const { id } = req.params;
    const deleteFuncApp = await funcAppEntity.findByIdAndDelete(id);
    res.json({ mess: "Xóa chức năng phần mềm thành công", success: true });
  } catch (error) {
    res.json({
      mess: "Xóa chức năng phần mềm thất bại",
      success: false,
      error: error.message,
    });
  }
};
export const addApp = async (req, res) => {
  try {
    const { nameApp, infoApp, funcApp } = req.body;
    const newApp = appEntity.create({
      image: req.file.path,
      cloudinary_id: req.file.filename,
      name: nameApp,
      info: infoApp,
      func: funcApp,
    });
    const io = req.app.get("socketio");
    const allApp = await appEntity.find().sort("-createAt");
    io.emit("update-app", allApp);
    res.json({ mess: "Tạo phần mềm thành công", success: true });
  } catch (error) {
    res.json({
      mess: "Tạo phần mềm thất bại",
      success: false,
      error: error.message,
    });
  }
};
export const getUpdateApp=async(req,res)=>{
  try {
  const {id}=req.params;
  const app=await appEntity.findById(id);
  res.json({data:app});
  } catch (error) {
  console.error("Lỗi không tìm được app theo id");
  }
}
export const putUpdateApp=async(req,res)=>{
  try {
    const {id}=req.params;
    const {nameApp,infoApp,funcApp}=req.body;
    const updateApp=await appEntity.findByIdAndUpdate(id,{
      name:nameApp,
      info:infoApp,
      func:funcApp,
    })
    const io = req.app.get("socketio");
    const allApp = await appEntity.find().sort("-createAt");
    io.emit("update-app", allApp);
    res.json({mess:"Cập nhật phần mềm thành công",success:true});
  } catch (error) {
    res.json({mess:"Cập nhật phần mềm thất bại",success:false,error:error.message});
  }
};
export const deleteApp=async(req,res)=>{
  try {
  const {id}=req.params;
  const app = await appEntity.findById(id);
    if (!app) {
      res.json({ mess: "Không tìm thấy app", success: false });
    }
    await cloudinary.uploader.destroy(app.cloudinary_id);
    await appEntity.findByIdAndDelete(id);
    const io = req.app.get("socketio");
    const allApp = await appEntity.find().sort("-createAt");
    io.emit("update-app", allApp);
  res.json({mess:"Xóa phần mềm thành công",success:true});
  } catch (error) {
  res.json({mess:"Xóa phần mềm thất bại",success:false,error:error.message});
  }
  
}
