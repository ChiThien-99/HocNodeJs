import dotenv from "dotenv";
dotenv.config();
import os from "os";
import { json } from "stream/consumers";
import { adminEntity } from "../models/admin.model.js";
import { carouselEntity } from "../models/carousel.model.js";
import { notifyEntity } from "../models/notification.model.js";
import { bannerEntity } from "../models/banner.model.js";
import { funcAppEntity } from "../models/funcApp.model.js";
import { appEntity } from "../models/app.model.js";
import { funcDeviceEntity } from "../models/funcDevice.model.js";
import { deviceEntity } from "../models/device.model.js";
import { categoryblogsEntity } from "../models/categoryblogs.model.js";
import { blogsEntity } from "../models/blogs.model.js";
import { blogsDraftEntity } from "../models/blogDraft.model.js";
import { problemEntity } from "../models/problem.model.js";
import { v2 as cloudinary } from "cloudinary";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { voucherEntity } from "../models/voucher.model.js";
import { clientEntity } from "../models/client.model.js";
import { orderEntity } from "../models/order.model.js";
import { jobEntity } from "../models/job.model.js";
import PDFDocument from "pdfkit";
import path from "path";
import { fileURLToPath } from "url";
import webpush from "web-push";
import cron from "node-cron";
import mongoose from "mongoose";
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
  const carousels = await carouselEntity.find().sort("order");
  const notifys = await notifyEntity.find().sort("-createAt");
  const bns = await bannerEntity.find();
  const listFuncApp = await funcAppEntity.find().sort("-createAt");
  const apps = await appEntity.find().sort("-createAt");
  const listFuncDevice = await funcDeviceEntity.find().sort("-createAt");
  const devices = await deviceEntity.find().sort("-createAt");
  const listCategoryblogs = await categoryblogsEntity.find().sort("-createAt");
  const listblogs = await blogsEntity.find().sort("-createAt");
  const listblogsdraft = await blogsDraftEntity.find();
  const problems = await problemEntity.find().sort("-createAt");
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const orders = await orderEntity
    .find({ createAt: { $gte: thirtyDaysAgo } })
    .sort({ createAt: -1 });
  const jobs = await jobEntity.aggregate([
    {
      $addFields: {
        priorityOrder: {
          $switch: {
            branches: [
              { case: { $eq: ["$level", "Gấp"] }, then: 1 },
              { case: { $eq: ["$level", "Ưu tiên"] }, then: 2 },
              { case: { $eq: ["$level", "Thong thả"] }, then: 3 },
            ],
            default: 4, // Phòng thủ nếu có trạng thái lạ lọt vào hệ thống
          },
        },
      },
    },
    // Bước 2: Sắp xếp tăng dần theo trọng số (1 -> 2 -> 3) [cite: 2026-01-28]
    {
      $sort: { priorityOrder: 1, createdAt: -1 }, // Nếu cùng mức độ ưu tiên, đơn mới hơn xếp lên trước [cite: 2026-01-28]
    },
    // Bước 3: Xóa bỏ trường tạm 'priorityOrder' trước khi trả về để giữ sạch dữ liệu đầu ra [cite: 2026-01-28]
    {
      $project: { priorityOrder: 0 },
    },
  ]);
  const io = req.app.get("socketio");
  res.render("dashboard.ejs", {
    jsonSystemInfo,
    admins,
    carousels,
    notifys,
    bns,
    listFuncApp,
    apps,
    listFuncDevice,
    devices,
    listCategoryblogs,
    listblogs,
    listblogsdraft,
    problems,
    orders,
    DocSoTienVietNam,
    jobs,
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
    const adminNeedUpdate = adminEntity.findById(idUpdate);
    if (!pwAdmin) {
      pwAdmin = adminNeedUpdate.password;
    } else {
      const salt = await bcrypt.genSalt(10);
      pwAdmin = await bcrypt.hash(pwAdmin, salt);
    }

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
export const postCarousel = async (req, res) => {
  try {
    const { captionCarousel, urlCarousel, orderCarousel } = req.body;
    const newCarousel = await carouselEntity.create({
      caption: captionCarousel,
      url: urlCarousel,
      order: orderCarousel,
      image: req.file.path,
      cloudinary_id: req.file.filename,
    });
    const io = req.app.get("socketio");
    const allCarousel = await carouselEntity.find();
    io.emit("update-carousel", allCarousel);
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
    const banner = await carouselEntity.findById(id);
    res.json({ data: banner });
  } catch (error) {
    console.error(error.message);
  }
};
export const putUpdateCarousel = async (req, res) => {
  try {
    const { id } = req.params;
    const currentCarousel = await carouselEntity.findById(id);
    const { captionCarousel, urlCarousel, orderCarousel } = req.body;
    let image = "";
    let cloudinary_id = "";
    if (req.file) {
      image = req.file.path;
      cloudinary_id = req.file.filename;
    } else {
      image = currentCarousel.image;
      cloudinary_id = currentCarousel.cloudinary_id;
    }
    const updateBanner = await carouselEntity.findByIdAndUpdate(
      id,
      {
        image: image,
        cloudinary_id: cloudinary_id,
        caption: captionCarousel,
        url: urlCarousel,
        order: orderCarousel,
      },
      { new: true },
    );
    const io = req.app.get("socketio");
    io.emit("update-carousel", updateBanner);
    res.json({ mess: "Cập nhật carousel thành công", success: true });
  } catch (error) {
    res.json({
      mess: "Cập nhật carousel thất bại",
      success: false,
      error: error.message,
    });
  }
};
export const deleteImgCarousel = async (req, res) => {
  try {
    const { id } = req.params;
    const carouselNeedDeleteImg = await carouselEntity.findById(id);
    await cloudinary.uploader.destroy(carouselNeedDeleteImg.cloudinary_id);
    res.json({ mess: "Xóa hình carousel thành công", success: true });
  } catch (error) {
    res.json({
      mess: "Xóa hình carousel thất bại",
      success: false,
      error: error.message,
    });
  }
};
export const deleteCarousel = async (req, res) => {
  try {
    const { id } = req.params;
    const carousel = await carouselEntity.findById(id);
    if (!carousel) {
      res.json({ mess: "Không tìm thấy banner", success: false });
    }
    await cloudinary.uploader.destroy(carousel.cloudinary_id);
    const deleteCarousel = await carouselEntity.findByIdAndDelete(id);
    const allCarousel = await carouselEntity.find();
    const io = req.app.get("socketio");
    io.emit("delete-carousel", { allCarousel, deleteCarousel });
    res.json({ mess: "Xóa carousel thành công", success: true });
  } catch (error) {
    res.json({
      mess: "Xóa carousel thất bại",
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
    io.emit("update-notify", newNotify);
    const delay = expiredDate.getTime() - Date.now();
    console.log(delay);
    setTimeout(async () => {
      const allNotify = await notifyEntity.find().sort("-createAt");
      io.emit("update-notify", allNotify);
      console.log("Đã cập nhật lại thông báo");
    }, delay + 60000);
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
    const updateNotify = await notifyEntity.findByIdAndUpdate(
      id,
      {
        type: typeNotify,
        content: contentNotify,
        url: urlNotify,
        expireAt: expiredDate,
      },
      { new: true },
    );
    const io = req.app.get("socketio");
    io.emit("update-notify", updateNotify);
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
    io.emit("delete-notify", delNotify);
    res.json({ mess: "Xóa thông báo thành công", success: true });
  } catch (error) {
    res.json({
      mess: "Xóa thông báo thất bại",
      success: false,
      error: error.message,
    });
  }
};
export const addBanner = async (req, res) => {
  try {
    const { pageBanner, urlBN } = req.body;
    const newBanner = await bannerEntity.create({
      page: pageBanner,
      image: req.file.path,
      cloudinary_id: req.file.filename,
      url: urlBN,
    });
    const io = req.app.get("socketio");
    io.emit("update-banner", newBanner);
    res.json({ mess: "Tạo banner thành công", success: true });
  } catch (error) {
    res.json({
      mess: "Tạo banner thất bại",
      success: false,
      error: error.message,
    });
  }
};
export const getUpdateBanner = async (req, res) => {
  const { id } = req.params;
  const updateBanner = await bannerEntity.findById(id);
  res.json({ data: updateBanner });
};
export const deleteImgBanner = async (req, res) => {
  try {
    const { id } = req.params;
    const bannerNeedDelete = await bannerEntity.findById(id);
    if (!bannerNeedDelete) {
      return res.json({
        mess: "Không tìm được banner cần xóa hình",
        success: false,
      });
    }
    cloudinary.uploader.destroy(bannerNeedDelete.cloudinary_id);
    res.json({ mess: "Xóa hình banner thành công", success: true });
  } catch (error) {
    res.json({
      mess: "Xóa hình banner thất bại",
      success: false,
      error: error.message,
    });
  }
};
export const putUpdateBN = async (req, res) => {
  try {
    const { id } = req.params;
    const { pageBanner, urlBN } = req.body;
    const currentBanner = await bannerEntity.findById(id);
    let image = "";
    let cloudinary_id = "";
    if (req.file) {
      image = req.file.path;
      cloudinary_id = req.file.filename;
    } else {
      image = currentBanner.image;
      cloudinary_id = currentBanner.cloudinary_id;
    }
    const updateBanner = await bannerEntity.findByIdAndUpdate(
      id,
      {
        page: pageBanner,
        image: image,
        cloudinary_id: cloudinary_id,
        url: urlBN,
      },
      { new: true },
    );
    const io = req.app.get("socketio");
    io.emit("update-banner", updateBanner);
    res.json({ mess: "Cập nhật banner thành công", success: true });
  } catch (error) {
    res.json({
      mess: "Cập nhật banner thất bại",
      success: false,
      error: error.message,
    });
  }
};
export const deleteBN = async (req, res) => {
  try {
    const { id } = req.params;
    const banner = await bannerEntity.findById(id);
    await cloudinary.uploader.destroy(banner.cloudinary_id);
    const deleteBanner = await bannerEntity.findByIdAndDelete(id);
    const io = req.app.get("socketio");
    io.emit("delete-banner", deleteBanner);
    res.json({ mess: "Xóa banner thành công", success: true });
  } catch (error) {
    res.json({
      mess: "Xóa banner thất bại",
      success: false,
      error: error.message,
    });
  }
};
export const addListFuncApp = async (req, res) => {
  try {
    const { listFuncApp } = req.body;
    const newFuncApp = await funcAppEntity.create({ name: listFuncApp });
    const io = req.app.get("socketio");
    io.emit("update-funcapp", newFuncApp);
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
    const updateFuncApp = await funcAppEntity.findByIdAndUpdate(
      id,
      {
        name: listFuncApp,
      },
      { new: true },
    );
    const io = req.app.get("socketio");
    io.emit("update-funcapp", updateFuncApp);
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
    const io = req.app.get("socketio");
    io.emit("delete-funcapp", deleteFuncApp);
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
    const {
      nameApp,
      infoApp,
      funcApp,
      optionPrice,
      priceLEActualApp,
      priceSIActualApp,
      instructionApp,
    } = req.body;
    let priceLE = "";
    let priceSI = "";
    if (optionPrice === "freeApp") {
      priceLE = "Miễn phí";
      priceSI = "Miễn phí";
    } else {
      priceLE = priceLEActualApp;
      priceSI = priceSIActualApp;
    }
    const newApp = await appEntity.create({
      image: req.file.path,
      cloudinary_id: req.file.filename,
      name: nameApp,
      priceLE: priceLE,
      priceSI: priceSI,
      info: infoApp,
      func: funcApp,
      instruction: instructionApp,
    });
    const io = req.app.get("socketio");
    io.emit("update-app", newApp);
    res.json({ mess: "Tạo phần mềm thành công", success: true });
  } catch (error) {
    res.json({
      mess: "Tạo phần mềm thất bại",
      success: false,
      error: error.message,
    });
  }
};
export const getUpdateApp = async (req, res) => {
  try {
    const { id } = req.params;
    const app = await appEntity.findById(id);
    res.json({ data: app });
  } catch (error) {
    console.error("Lỗi không tìm được app theo id");
  }
};
export const putUpdateApp = async (req, res) => {
  try {
    const { id } = req.params;
    const currentApp = await appEntity.findById(id);
    let image = "";
    let cloudinary_id = "";
    if (req.file) {
      image = req.file.path;
      cloudinary_id = req.file.filename;
    } else {
      image = currentApp.image;
      cloudinary_id = currentApp.cloudinary_id;
    }
    const {
      nameApp,
      infoApp,
      funcApp,
      optionPrice,
      priceLEActualApp,
      priceSIActualApp,
      instructionApp,
    } = req.body;
    let priceLE = "";
    let priceSI = "";
    if (optionPrice === "freeApp") {
      priceLE = "Miễn phí";
      priceSI = "Miễn phí";
    } else {
      priceLE = priceLEActualApp;
      priceSI = priceSIActualApp;
    }
    const updateApp = await appEntity.findByIdAndUpdate(
      id,
      {
        image: image,
        cloudinary_id: cloudinary_id,
        name: nameApp,
        info: infoApp,
        priceLE: priceLE,
        priceSI: priceSI,
        func: funcApp,
        instruction: instructionApp,
      },
      { new: true },
    );
    const io = req.app.get("socketio");
    io.emit("update-app", updateApp);
    res.json({ mess: "Cập nhật phần mềm thành công", success: true });
  } catch (error) {
    res.json({
      mess: "Cập nhật phần mềm thất bại",
      success: false,
      error: error.message,
    });
  }
};
export const deleteImgApp = async (req, res) => {
  try {
    const { id } = req.params;
    const appNeedDeleteImg = await appEntity.findById(id);
    if (!appNeedDeleteImg) {
      return res.json({
        mess: "Không tìm được app cần xóa hình",
        success: false,
      });
    }
    if (appNeedDeleteImg.image && appNeedDeleteImg.cloudinary_id) {
      await cloudinary.uploader.destroy(appNeedDeleteImg.cloudinary_id);
    }
    res.json({ mess: "Xóa hình app thành công", success: true });
  } catch (error) {
    res.json({
      mess: "Xóa hình app thất bại",
      success: false,
      error: error.message,
    });
  }
};
export const deleteApp = async (req, res) => {
  try {
    const { id } = req.params;
    const app = await appEntity.findById(id);
    if (!app) {
      res.json({ mess: "Không tìm thấy app", success: false });
    }
    await cloudinary.uploader.destroy(app.cloudinary_id);
    const deleteApp = await appEntity.findByIdAndDelete(id);
    const io = req.app.get("socketio");
    io.emit("delete-app", deleteApp);
    res.json({ mess: "Xóa phần mềm thành công", success: true });
  } catch (error) {
    res.json({
      mess: "Xóa phần mềm thất bại",
      success: false,
      error: error.message,
    });
  }
};
export const addListFuncDevice = async (req, res) => {
  try {
    const { listFuncDevice } = req.body;
    const newFuncDevice = await funcDeviceEntity.create({
      name: listFuncDevice,
    });
    const io = req.app.get("socketio");
    io.emit("update-funcdevice", newFuncDevice);
    res.json({ mess: "Tạo chức năng thiết bị thành công", success: true });
  } catch (error) {
    res.json({
      mess: "Tạo chức năng thiết bị thất bại",
      success: false,
      error: error.message,
    });
  }
};
export const getUploadFuncDevice = async (req, res) => {
  try {
    const { id } = req.params;
    const funcDevice = await funcDeviceEntity.findById(id);
    res.json({ data: funcDevice });
  } catch (error) {
    console.error(`Lỗi: ${error}`);
  }
};
export const putUpdateFuncDevice = async (req, res) => {
  try {
    const { id } = req.params;
    const { listFuncDevice } = req.body;
    const updateFuncDevice = await funcDeviceEntity.findByIdAndUpdate(
      id,
      { name: listFuncDevice },
      { new: true },
    );
    const io = req.app.get("socketio");
    io.emit("update-funcdevice", updateFuncDevice);
    res.json({ mess: "Cập nhật chức năng thiết bị thành công", success: true });
  } catch (error) {
    res.json({
      mess: "Cập nhật chức năng thiết bị thất bại",
      success: false,
      error: error.message,
    });
  }
};
export const deleteFuncDevice = async (req, res) => {
  try {
    const { id } = req.params;
    const deleteFuncDevice = await funcDeviceEntity.findByIdAndDelete(id);
    const io = req.app.get("socketio");
    io.emit("delete-funcdevice", deleteFuncDevice);
    res.json({ mess: "Xóa chức năng thiết bị thành công", success: true });
  } catch (error) {
    res.json({
      mess: "Xóa chức năng thiết bị thất bại",
      success: false,
      error: error.message,
    });
  }
};
export const addDevice = async (req, res) => {
  try {
    let {
      imgDevice,
      nameDevice,
      infoDevice,
      colorNames,
      colorIndex,
      priceLEDeviceActual,
      priceSIDeviceActual,
      funcDevice,
      instrucDevice,
    } = req.body;
    if (!req.files || req.files.length === 0) {
      return res.json({
        mess: "Vui lòng chọn ít nhất một ảnh",
        success: false,
      });
    }
    const colorFiles = req.files["colorImg"] || [];
    const deviceFiles = req.files["imgDevice"] || [];
    const uploadedDeviceImages = deviceFiles.map((file) => {
      return {
        url: file.path,
        cloudinary_id: file.filename,
      };
    });
    let uploadedColorImages = {};
    if (colorNames && colorNames.length > 0) {
      colorNames = Array.isArray(colorNames) ? colorNames : [colorNames];
      uploadedColorImages = colorNames.map((name, index) => {
        const file = colorFiles[index];
        let idColor = colorIndex[index];
        idColor = Number(idColor);
        if (file) {
          return {
            name: name,
            index: idColor,
            url: file.path,
            cloudinary_id: file.filename,
          };
        }
        return null;
      });
    }
    const newDevice = await deviceEntity.create({
      images: uploadedDeviceImages,
      color: uploadedColorImages,
      name: nameDevice,
      info: infoDevice,
      cost: 0,
      priceLE: priceLEDeviceActual,
      priceSI: priceSIDeviceActual,
      inventory: 0,
      func: funcDevice,
      instruction: instrucDevice,
    });
    const io = req.app.get("socketio");
    io.emit("update-device", newDevice);
    res.json({ mess: "Tạo thiết bị thành công", success: true });
  } catch (error) {
    res.json({
      mess: "Tạo thiết bị thất bại",
      success: false,
      error: error.message,
    });
  }
};
export const getUpdateDevice = async (req, res) => {
  try {
    const { id } = req.params;
    const device = await deviceEntity.findById(id);
    res.json({ data: device });
  } catch (error) {
    console.error(`Lỗi lấy device bằng id: ${error}`);
  }
};
export const putUpdateDevice = async (req, res) => {
  try {
    const { id } = req.params;
    const currentDevice = deviceEntity.findById(id);
    if (!currentDevice) {
      return res.json({
        mess: "Không tìm thấy thiết bị cần chỉnh sửa",
        success: true,
      });
    }
    let {
      nameDevice,
      infoDevice,
      priceLEDeviceActual,
      priceSIDeviceActual,
      colorNames,
      colorIndex,
      funcDevice,
      instrucDevice,
    } = req.body;

    const colorFiles = req.files["colorImg"] || [];
    const deviceFiles = req.files["imgDevice"] || [];
    const uploadedDeviceImages = deviceFiles.map((file) => {
      return {
        url: file.path,
        cloudinary_id: file.filename,
      };
    });
    let uploadedColorImages = {};
    if (colorNames && colorNames.length > 0) {
      colorNames = Array.isArray(colorNames) ? colorNames : [colorNames];
      uploadedColorImages = colorNames.map((name, index) => {
        const file = colorFiles[index];
        let idColor = colorIndex[index];
        idColor = Number(idColor);
        if (file) {
          return {
            name: name,
            index: idColor,
            url: file.path,
            cloudinary_id: file.filename,
          };
        }
        return null;
      });
    }
    let images =
      uploadedDeviceImages.length > 0
        ? uploadedDeviceImages
        : currentDevice.images;
    console.log(images);
    let color = uploadedColorImages.includes(null)
      ? currentDevice.color
      : uploadedColorImages;
    console.log(color);
    const updateDevice = await deviceEntity.findByIdAndUpdate(
      id,
      {
        images: images,
        name: nameDevice,
        info: infoDevice,
        color: color,
        priceLE: priceLEDeviceActual,
        priceSI: priceSIDeviceActual,
        func: funcDevice,
        instruction: instrucDevice,
      },
      { new: true },
    );
    const io = req.app.get("socketio");
    io.emit("update-detailDevice", updateDevice);
    io.emit("update-device", updateDevice);
    res.json({ mess: "Cập nhật thiết bị thành công", success: true });
  } catch (error) {
    res.json({
      mess: "Cập nhật thiết bị thất bại",
      success: false,
      error: error.message,
    });
  }
};
export const deleteImgDevice = async (req, res) => {
  try {
    const { id } = req.params;
    const device = await deviceEntity.findById(id);
    if (!device) {
      return res.json({
        mess: "Không tim được device xóa hình",
        success: false,
      });
    }
    if (device.images && device.images.length > 0) {
      const deletePromises = device.images.map((img) => {
        console.log(img.cloudinary_id);
        return cloudinary.uploader.destroy(img.cloudinary_id);
      });
      await Promise.all(deletePromises);
    }
    res.json({ mess: "Xóa hình ảnh thiết bị thành công", success: true });
  } catch (error) {
    res.json({
      mess: "Xóa hình ảnh thiết bị thất bại",
      success: false,
      error: error.message,
    });
  }
};
export const deleteImgColorDevice = async (req, res) => {
  try {
    const { id } = req.params;
    const device = await deviceEntity.findById(id);
    if (!device) {
      return res.json({
        mess: "Không tim được device bằng id",
        success: false,
      });
    }
    if (device.color && device.color.length > 0) {
      const deletePromises = device.color.map((color) => {
        return cloudinary.uploader.destroy(color.cloudinary_id);
      });
      await Promise.all(deletePromises);
    }
    res.json({ mess: "Xóa hình ảnh màu thiết bị thành công", success: true });
  } catch (error) {
    res.json({
      mess: "Xóa hình ảnh màu thiết bị thất bại",
      success: false,
      error: error.message,
    });
  }
};
export const deleteDevice = async (req, res) => {
  try {
    const { id } = req.params;
    const device = await deviceEntity.findById(id);
    if (!device) {
      return res.json({
        mess: "Không tim được device bằng id",
        success: false,
      });
    }
    if (device.images && device.images.length > 0) {
      const deletePromises = device.images.map((img) => {
        return cloudinary.uploader.destroy(img.cloudinary_id);
      });
      await Promise.all(deletePromises);
    }
    const deleteDevice = await deviceEntity.findByIdAndDelete(id);
    const io = req.app.get("socketio");
    const allDevice = await deviceEntity.find().sort("-createAt");
    io.emit("delete-device", deleteDevice);
    res.json({ mess: "Xóa thiết bị thành công", success: true });
  } catch (error) {
    res.json({
      mess: "Xóa thiết bị thất bại",
      success: false,
      error: error.message,
    });
  }
};
export const addblogs = async (req, res) => {
  try {
    const { titleblogs, infoblogs, categoryblogs } = req.body;
    const newBlog = await blogsEntity.create({
      image: req.file.path,
      cloudinary_id: req.file.filename,
      title: titleblogs,
      info: infoblogs,
      category: categoryblogs,
    });
    const io = req.app.get("socketio");
    io.emit("update-blogs", newBlog);
    res.json({ mess: "Tạo blogs thành công", success: true });
  } catch (error) {
    res.json({
      mess: "Tạo blogs thất bại",
      success: false,
      error: error.message,
    });
  }
};
export const postDraft = async (req, res) => {
  try {
    const { id } = req.params;
    const blogsDraft = await blogsDraftEntity.findById(id);
    if (!blogsDraft) {
      return res.json({
        mess: "Không lấy được blogs nháp để xóa",
        success: false,
      });
    }
    const { titleblogs, infoblogs, categoryblogs } = req.body;
    let image = "";
    let cloudinary_id = "";
    if (req.file) {
      image = req.file.path;
      cloudinary_id = req.file.filename;
    } else {
      image = blogsDraft.image;
      cloudinary_id = blogsDraft.cloudinary_id;
    }
    const newBlog = await blogsEntity.create({
      image: image,
      cloudinary_id: cloudinary_id,
      title: titleblogs,
      info: infoblogs,
      category: categoryblogs,
    });
    const deleteBlog = await blogsDraftEntity.findByIdAndDelete(id);
    const io = req.app.get("socketio");
    io.emit("update-blogs", newBlog);
    io.emit("delete-blogsdraft", deleteBlog);
    res.json({ mess: "Tạo blogs thành công", success: true });
  } catch (error) {
    res.json({
      mess: "Tạo blogs thất bại",
      success: false,
      error: error.message,
    });
  }
};
export const addBlogDraft = async (req, res) => {
  try {
    const { titleblogs, infoblogs, categoryblogs } = req.body;
    const newBlog = await blogsDraftEntity.create({
      image: req.file.path,
      cloudinary_id: req.file.filename,
      title: titleblogs,
      info: infoblogs,
      category: categoryblogs,
    });
    const io = req.app.get("socketio");
    io.emit("update-blogsDraft", newBlog);
    res.json({ mess: "Tạo nháp blogs thành công", success: true });
  } catch (error) {
    res.json({
      mess: "Tạo nháp blogs thất bại",
      success: false,
      error: error.message,
    });
  }
};
export const getEditBlogDraft = async (req, res) => {
  const { id } = req.params;
  const editBlog = await blogsDraftEntity.findById(id);
  res.json({ data: editBlog });
};
export const putEditBlogDraft = async (req, res) => {
  try {
    const { id } = req.params;
    const currentBlog = await blogsDraftEntity.findById(id);
    const { titleblogs, infoblogs, categoryblogs } = req.body;
    let image = "";
    let cloudinary_id = "";
    if (req.file) {
      image = req.file.path;
      cloudinary_id = req.file.filename;
    } else {
      image = currentBlog.image;
      cloudinary_id = currentBlog.cloudinary_id;
    }
    const updateBlogDraft = await blogsDraftEntity.findByIdAndUpdate(
      id,
      {
        image: image,
        cloudinary_id: cloudinary_id,
        title: titleblogs,
        info: infoblogs,
        category: categoryblogs,
      },
      { new: true },
    );
    const io = req.app.get("socketio");
    io.emit("update-blogsDraft", updateBlogDraft);
    res.json({ mess: "Lưu nháp blogs thành công", success: true });
  } catch (error) {
    res.json({
      mess: "Lưu nháp blogs thất bại",
      success: false,
      error: error.message,
    });
  }
};
export const deleteBlogDraft = async (req, res) => {
  try {
    const { id } = req.params;
    const blogs = await blogsDraftEntity.findById(id);
    if (!blogs) {
      return res.json({
        mess: "Không lấy được blogs nháp để xóa",
        success: false,
      });
    }
    await cloudinary.uploader.destroy(blogs.cloudinary_id);
    const deleteBlog = await blogsDraftEntity.findByIdAndDelete(id);
    const io = req.app.get("socketio");
    io.emit("delete-blogsdraft", deleteBlog);
    res.json({ mess: "Xóa blogs nháp thành công", success: true });
  } catch (error) {
    res.json({
      mess: "Xóa blogs nháp thất bại",
      success: false,
      error: error.message,
    });
  }
};
export const addCategoryblogs = async (req, res) => {
  try {
    const { categoryblogs } = req.body;
    const newCategoryBlog = await categoryblogsEntity.create({
      name: categoryblogs,
    });
    const io = req.app.get("socketio");
    io.emit("update-categoryblogs", newCategoryBlog);
    res.json({ mess: "Tạo danh mục blogs thành công", success: true });
  } catch (error) {
    res.json({
      mess: "Tạo danh mục blogs thất bại",
      success: false,
      error: error.message,
    });
  }
};
export const getUpdateCategoryblogs = async (req, res) => {
  try {
    const { id } = req.params;
    const categoryblogs = await categoryblogsEntity.findById(id);
    res.json({ data: categoryblogs });
  } catch (error) {
    console.error(`Lỗi không lấy được data ${error}`);
  }
};
export const putUpdateCategoryblogs = async (req, res) => {
  try {
    const { id } = req.params;
    const { categoryblogs } = req.body;
    const updateCategoryBlog = await categoryblogsEntity.findByIdAndUpdate(
      id,
      { name: categoryblogs },
      { new: true },
    );
    const io = req.app.get("socketio");
    io.emit("update-categoryblogs", updateCategoryBlog);
    res.json({ mess: "Cập nhật danh mục blogs thành công", success: true });
  } catch (error) {
    res.json({
      mess: "Cập nhật danh mục blogs thất bại",
      success: false,
      error: error.message,
    });
  }
};
export const deleteCategoryblogs = async (req, res) => {
  try {
    const { id } = req.params;
    const deleteCategoryBlog = await categoryblogsEntity.findByIdAndDelete(id);
    const io = req.app.get("socketio");
    io.emit("delete-categoryblogs", deleteCategoryBlog);
    res.json({ mess: "Xóa danh mục blogs thành công", success: true });
  } catch (error) {
    res.json({
      mess: "Xóa danh mục blogs thất bại",
      success: false,
      error: error.message,
    });
  }
};
export const getUpdateblogs = async (req, res) => {
  try {
    const { id } = req.params;
    const blogs = await blogsEntity.findById(id);
    res.json({ data: blogs });
  } catch (error) {
    console.error(`Lỗi không lấy được data ${error}`);
  }
};
export const putUpdateblogs = async (req, res) => {
  try {
    const { id } = req.params;
    const currentBlog = await blogsEntity.findById(id);
    const { titleblogs, infoblogs, categoryblogs } = req.body;
    let image = "";
    let cloudinary_id = "";
    if (req.file) {
      image = req.file.path;
      cloudinary_id = req.file.filename;
    } else {
      image = currentBlog.image;
      cloudinary_id = currentBlog.cloudinary_id;
    }
    const updateBlog = await blogsEntity.findByIdAndUpdate(
      id,
      {
        image: image,
        cloudinary_id: cloudinary_id,
        title: titleblogs,
        info: infoblogs,
        category: categoryblogs,
      },
      { new: true },
    );
    const io = req.app.get("socketio");
    io.emit("update-blogs", updateBlog);
    res.json({ mess: "Cập nhật blogs thành công", success: true });
  } catch (error) {
    res.json({
      mess: "Cập nhật blogs thất bại",
      success: false,
      error: error.message,
    });
  }
};
export const deleteImgBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const blogNeedDelete = await blogsEntity.findById(id);
    await cloudinary.uploader.destroy(blogNeedDelete.cloudinary_id);
    res.json({ mess: "Xóa hình ảnh blog thành công", success: true });
  } catch (error) {
    res.json({ mess: "Xóa hình ảnh blog thất bại", success: false });
  }
};
export const deleteblogs = async (req, res) => {
  try {
    const { id } = req.params;
    const blogs = await blogsEntity.findById(id);
    if (!blogs) {
      return res.json({ mess: "Không lấy được blogs để xóa", success: false });
    }
    await cloudinary.uploader.destroy(blogs.cloudinary_id);
    const deleteBlog = await blogsEntity.findByIdAndDelete(id);
    const io = req.app.get("socketio");
    io.emit("delete-blogs", deleteBlog);
    res.json({ mess: "Xóa blogs thành công", success: true });
  } catch (error) {
    res.json({
      mess: "Xóa blogs thất bại",
      success: false,
      error: error.message,
    });
  }
};
export const uploadImage = async (req, res) => {
  try {
    const url = req.file.path;
    res.json({ data: url });
  } catch (error) {
    console.error(`Không lấy được url image blogs: ${error.message}`);
  }
};
export const getProblemById = async (req, res) => {
  const { id } = req.params;
  const currentProblem = await problemEntity.findById(id);
  res.json({ data: currentProblem });
};
export const deleteProblemById = async (req, res) => {
  try {
    const { id } = req.params;
    const deleteProblem = await problemEntity.findByIdAndDelete(id);
    const io = req.app.get("socketio");
    io.emit("delete-problem", deleteProblem);
    res.json({ mess: "Xóa problem thành công", success: true });
  } catch (error) {
    res.json({
      mess: "Xóa problem thất bại",
      success: false,
      error: error.message,
    });
  }
};
function generateRandomCode(length = 10) {
  const characters = "ABCDEFGHJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters.charAt(randomIndex);
  }
  return result;
}
export const addVoucher = async (req, res) => {
  try {
    const {
      genderClient,
      categoryVoucher,
      titleVoucher,
      contentVoucher,
      discountPerVoucher,
    } = req.body;
    let uniqueCode = "";
    let isDuplicate = true;
    while (isDuplicate) {
      uniqueCode = generateRandomCode(10);
      const existCodeVoucher = await voucherEntity.findOne({
        code: uniqueCode,
      });
      if (!existCodeVoucher) {
        isDuplicate = false;
      }
    }
    let client = [];
    if (genderClient != "all") {
      client = await clientEntity.find({ gender: genderClient });
    } else {
      client = await clientEntity.find();
    }
    const clientsId = client.map((c) => c._id.toString());
    if (!req.file) {
      return res.json({
        mess: "Vui lòng chọn hình ảnh voucher",
        success: false,
      });
    }
    if (!categoryVoucher) {
      return res.json({
        mess: "Vui lòng chọn sản phẩm áp dụng",
        success: false,
      });
    }
    if (!titleVoucher) {
      return res.json({
        mess: "Vui lòng chọn tiêu đề voucher",
        success: false,
      });
    }
    if (!contentVoucher) {
      return res.json({
        mess: "Vui lòng chọn nội dung voucher",
        success: false,
      });
    }
    if (!discountPerVoucher) {
      return res.json({
        mess: "Vui lòng chọn phần trăm giảm giá",
        success: false,
      });
    }
    await voucherEntity.create({
      applyToCategory: categoryVoucher,
      code: uniqueCode,
      clientIds: clientsId,
      image: req.file.path,
      cloudinary_id: req.file.filename,
      title: titleVoucher,
      content: contentVoucher,
      discountPercentage: Number(discountPerVoucher),
      usersUsed: [],
    });
    res.json({ mess: "Tạo voucher thành công", success: true });
  } catch (error) {
    res.json({
      mess: "Tạo voucher thất bại",
      success: false,
      error: error.message,
    });
  }
};
export const updateOrder = async (req, res) => {
  try {
    const { id, valueInvoice, valueStatus } = req.body;
    await orderEntity.findByIdAndUpdate(id, {
      status: valueStatus,
      invoice: valueInvoice,
    });
    const totalOrder = await orderEntity.find();
    const totalOrderNotInvoice = await orderEntity.find({ invoice: "--" });
    const totalOrderHasInvoiceLen =
      totalOrder.length - totalOrderNotInvoice.length;
    const totalOrderLen = totalOrder.length;
    res.json({
      mess: "Cập nhật đơn hàng thành công",
      success: true,
      totalOrderLen,
      totalOrderHasInvoiceLen,
    });
  } catch (error) {
    res.json({
      mess: "Cập nhật đơn hàng thất bại",
      success: false,
      error: error.message,
    });
  }
};
const DocSoTienVietNam = (number) => {
  const digits = [
    "không",
    "một",
    "hai",
    "ba",
    "bốn",
    "năm",
    "sáu",
    "bảy",
    "tám",
    "chín",
  ];
  const units = ["", "nghìn", "triệu", "tỷ", "nghìn tỷ", "triệu tỷ"];

  if (number === 0) return "Không đồng";

  let strNumber = String(Math.floor(Math.abs(number)));
  // Đảm bảo độ dài chia hết cho 3 bằng cách bù số 0 vào đầu
  while (strNumber.length % 3 !== 0) {
    strNumber = "0" + strNumber;
  }

  let blocks = [];
  for (let i = 0; i < strNumber.length; i += 3) {
    blocks.push(strNumber.substr(i, 3));
  }

  let resultStrings = [];
  let totalBlocks = blocks.length;

  for (let i = 0; i < totalBlocks; i++) {
    let block = blocks[i];
    let h = Number(block[0]); // Hàng trăm
    let t = Number(block[1]); // Hàng chục
    let u = Number(block[2]); // Hàng đơn vị

    // Nếu block toàn số 0 và không phải block cuối cùng thì bỏ qua
    if (h === 0 && t === 0 && u === 0 && i !== totalBlocks - 1) {
      continue;
    }

    let blockText = "";
    // Đọc hàng trăm
    blockText += digits[h] + " trăm ";

    // Đọc hàng chục
    if (t === 0) {
      if (u !== 0) blockText += "lẻ ";
    } else if (t === 1) {
      blockText += "mười ";
    } else {
      blockText += digits[t] + " mươi ";
    }

    // Đọc hàng đơn vị
    if (t !== 0 && t !== 1 && u === 1) {
      blockText += "mốt";
    } else if (t !== 0 && u === 5) {
      blockText += "lăm";
    } else if (u !== 0) {
      blockText += digits[u];
    }

    // Cắt bỏ khoảng trắng thừa và thêm hàng đơn vị lớn (nghìn, triệu, tỷ...)
    blockText = blockText.trim();
    if (blockText !== "") {
      const unitIndex = totalBlocks - 1 - i;
      if (units[unitIndex] !== "") {
        blockText += " " + units[unitIndex];
      }
      resultStrings.push(blockText);
    }
  }

  // Ghép các chuỗi block lại thành chuỗi hoàn chỉnh
  let finalResult = resultStrings.join(" ").replace(/\s+/g, " ").trim();

  // Xử lý các trường hợp đọc "không trăm" dư thừa ở block đầu tiên nếu số nhỏ
  if (finalResult.startsWith("không trăm mươi")) {
    finalResult = finalResult.replace("không trăm mươi", "");
  } else if (finalResult.startsWith("không trăm lẻ")) {
    finalResult = finalResult.replace("không trăm lẻ", "");
  } else if (finalResult.startsWith("không trăm")) {
    finalResult = finalResult.replace("không trăm", "");
  }

  finalResult = finalResult.trim();
  // Viết hoa chữ cái đầu tiên và thêm chữ "đồng" chuẩn hóa đơn kế toán
  return finalResult.charAt(0).toUpperCase() + finalResult.slice(1) + " đồng";
};
export const downloadOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await orderEntity.findById(id);
    const client = await clientEntity.findById(order.idClient);
    const clientName = client.fullname;
    const doc = new PDFDocument({ size: "A4", margin: 50 });
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment;filename=${order.orderNumber}.pdf`,
    );
    doc.pipe(res);
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const fontRegular = path.resolve(
      __dirname,
      "../publics/OpenSans-Regular.ttf",
    );
    const fontBold = path.resolve(__dirname, "../publics/OpenSans-Bold.ttf");
    const logoPath = path.resolve(__dirname, "../publics/img/logo_imzai_1.png");
    const headerTopY = doc.y;
    doc.image(logoPath, 50, headerTopY, { width: 60 });
    doc.font(fontRegular).fontSize(10);
    doc.text("CÔNG TY TNHH CÔNG NGHỆ IMZEN", 130, headerTopY);
    doc.text("MST: 0123456789", 130, headerTopY + 15);
    doc.text(
      "ĐỊA CHỈ: 236 LÊ THỊ NGAY, XÃ VĨNH LỘC, THÀNH PHỐ HỒ CHÍ MINH, VIỆT NAM",
      130,
      headerTopY + 30,
    );
    doc.text(
      "STK 0123456789 tại NGÂN HÀNG QUỐC TẾ (VIB)",
      130,
      headerTopY + 45,
    );
    doc.moveDown(2);
    doc
      .font(fontBold)
      .fontSize(14)
      .text("Đơn hàng", 0, headerTopY + 75, { align: "center" });
    doc
      .font(fontRegular)
      .fontSize(10)
      .text(
        `Thời gian: ${new Date(order.createAt).toLocaleDateString("vi-VN")}`,
        { align: "center" },
      );
    doc.text(`Số phiếu: ${order.orderNumber}`, { align: "center" });
    doc.text(`Người mua: ${clientName}`, 50, headerTopY + 140);
    if (
      order.nameCompany === "--" &&
      order.addressCompany === "--" &&
      order.mstCompany === "--"
    ) {
      doc.text(
        `Tên người nhận: ${order.fullnameDelivery}`,
        50,
        headerTopY + 140 + 15,
      );
      if (order.paymentMethod != "Thanh toán khi nhận hàng") {
        const stampX = 380;
        const stampY = headerTopY + 140 + 5;
        doc.fillColor("#bbbbbb").strokeColor("#bbbbbb");
        doc.font(fontBold).fontSize(15);
        doc.text("ĐÃ THANH TOÁN", stampX + 15, stampY + 10, {
          width: 150,
          align: "center",
        });
        doc.lineWidth(3).rect(stampX, stampY, 180, 35).stroke();
        doc.fillColor("#000000").strokeColor("#000000");
        doc.font(fontRegular).fontSize(10);
        doc.lineWidth(1);
      }
      doc.text(
        `Số điện thoại: ${order.telDelivery}`,
        50,
        headerTopY + 140 + 30,
      );
      doc.text(
        `Địa chỉ nhận hàng: ${order.addressDelivery}`,
        50,
        headerTopY + 140 + 45,
      );
    } else {
      doc.text(`Tên công ty: ${order.nameCompany}`, 50, headerTopY + 140 + 15);
      if (order.paymentMethod != "Thanh toán khi nhận hàng") {
        const stampX = 380;
        const stampY = headerTopY + 140 + 5;
        doc.fillColor("#bbbbbb").strokeColor("#bbbbbb");
        doc.font(fontBold).fontSize(15);
        doc.text("ĐÃ THANH TOÁN", stampX + 15, stampY + 10, {
          width: 150,
          align: "center",
        });
        doc.lineWidth(3).rect(stampX, stampY, 180, 35).stroke();
        doc.fillColor("#000000").strokeColor("#000000");
        doc.font(fontRegular).fontSize(10);
        doc.lineWidth(1);
      }
      doc.text(
        `Địa chỉ công ty: ${order.addressCompany}`,
        50,
        headerTopY + 140 + 30,
      );
      doc.text(`MST: ${order.mstCompany}`, 50, headerTopY + 140 + 45);
    }
    doc.text("Diễn giải: VAT", 50, headerTopY + 140 + 60);
    doc.text("Loại tiền: VNĐ", 50, headerTopY + 140 + 75);
    const tableTop = headerTopY + 250;
    const colIndex = 50;
    const colName = 90;
    const colUnil = 210;
    const colQuantity = 250;
    const colPrice = 300;
    const colTotal = 430;
    doc.font(fontBold);
    doc.text("STT", colIndex, tableTop);
    doc.text("Tên hàng", colName, tableTop);
    doc.text("Đơn vị", colUnil, tableTop);
    doc.text("Số lượng", colQuantity, tableTop);
    doc.text("Đơn giá (bao gồm VAT)", colPrice, tableTop);
    doc.text("Thành tiền", colTotal, tableTop);
    doc
      .moveTo(50, tableTop + 15)
      .lineTo(550, tableTop + 15)
      .stroke();
    let itemY = tableTop + 25;
    doc.font(fontRegular);
    let totalOrderPrice = 0;
    order.products.forEach((prod, index) => {
      const itemTotal = prod.price * prod.quantity;
      totalOrderPrice += itemTotal;
      doc.text(index + 1, colIndex, itemY);
      doc.text(prod.productName, colName, itemY);
      doc.text("Cái", colUnil, itemY);
      doc.text(prod.quantity, colQuantity, itemY);
      doc.text(prod.price.toLocaleString("vi-VN"), colPrice, itemY);
      doc.text(itemTotal.toLocaleString("vi-VN"), colTotal, itemY);
      doc
        .moveTo(50, itemY + 15)
        .lineTo(550, itemY + 15)
        .strokeColor("#e0e0e0")
        .stroke();
      itemY += 20;
    });
    const totalAfterDiscount = totalOrderPrice - order.voucherDiscount;
    doc.font(fontBold).text("Chiết khấu:", 50, itemY + 15);
    doc
      .font(fontRegular)
      .text(
        `${order.voucherDiscount.toLocaleString("vi-VN")}đ`,
        430,
        itemY + 15,
      );
    doc.font(fontBold).text("Tổng tiền:", 50, itemY + 35);
    doc
      .font(fontRegular)
      .text(`${totalAfterDiscount.toLocaleString("vi-VN")}đ`, 430, itemY + 35);
    doc
      .font(fontBold)
      .text(
        `Số tiền bằng chữ: ${DocSoTienVietNam(totalAfterDiscount)}`,
        50,
        itemY + 55,
      );
    doc
      .font(fontRegular)
      .text(`Hình thức thanh toán: ${order.paymentMethod}`, 50, itemY + 75);
    doc.font(fontRegular).text("Người mua hàng", 90, itemY + 95);
    doc.font(fontRegular).text("Người bán hàng", 430, itemY + 95);
    doc.font(fontRegular).text("(Ký và ghi rõ họ tên)", 90, itemY + 110);
    doc.font(fontRegular).text("(Ký và ghi rõ họ tên)", 430, itemY + 110);
    doc.end();
  } catch (error) {
    res.setHeader("Content-Type", "application/json;charset=UTF-8");
    res.json({
      mess: "Không thể tạo file pdf từ đơn hàng này",
      success: false,
      error: error.message,
    });
  }
};
export const changeStatusOrders = async (req, res) => {
  try {
    const { arrChooseOrder, statusChange } = req.body;
    if (
      !arrChooseOrder ||
      !Array.isArray(arrChooseOrder) ||
      arrChooseOrder.length === 0
    ) {
      return res.json({
        mess: "Danh sách đơn hàng không hợp lệ",
        success: false,
      });
    }
    await orderEntity.updateMany(
      { _id: { $in: arrChooseOrder } },
      { status: statusChange },
    );
    const io = req.app.get("socketio");
    io.emit("updateStatusOrder", [arrChooseOrder, statusChange]);
    res.json({
      mess: "Cập nhật trạng thái đơn hàng thành công",
      success: true,
    });
  } catch (error) {
    res.json({
      mess: "Cập nhật trạng thái đơn hàng thất bại",
      success: false,
      error: error.message,
    });
  }
};
export const importDevice = async (req, res) => {
  try {
    const { idDeviceImport, importQuantityActual, costActual } = req.body;
    if (!importQuantityActual) {
      return res.json({ mess: "Vui lòng điền số lượng nhập", success: false });
    }
    if (!costActual) {
      return res.json({ mess: "Vui lòng điền giá vốn", success: false });
    }
    const device = await deviceEntity.findById(idDeviceImport);
    let inventory = device.inventory;
    let cost = device.cost;
    inventory += Number(importQuantityActual);
    const averageCost = (cost + Number(costActual)) / 2;
    await deviceEntity.findByIdAndUpdate(idDeviceImport, {
      cost: averageCost,
      inventory: inventory,
    });
    res.json({ mess: "Nhập kho thành công", success: true });
  } catch (error) {
    res.json({
      mess: "Nhập kho thất bại",
      success: false,
      error: error.message,
    });
  }
};
export const reloadOrder = async (req, res) => {
  const now = new Date();
  const thridDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const orders = await orderEntity
    .find({ createAt: { $gte: thridDaysAgo } })
    .sort({ createAt: -1 });
  res.json({ data: orders });
};
export const addJob = async (req, res) => {
  try {
    let { idAdmin, titleJob, levelJob, startTimeJob, deadlineJob } = req.body;
    console.log(startTimeJob);
    const admins = await adminEntity.find();
    if (!titleJob) {
      return res.json({ mess: "Vui lòng điền tên công việc", success: false });
    }
    if (!levelJob) {
      return res.json({
        mess: "Vui lòng điền cấp độ công việc",
        success: false,
      });
    }
    if (!startTimeJob) {
      return res.json({
        mess: "Vui lòng điền thời gian bắt đầu",
        success: false,
      });
    }
    if (!deadlineJob) {
      return res.json({ mess: "Vui lòng điền deadline", success: false });
    }
    // const [day, month, year] = deadlineJob.split("/");
    // deadlineJob = new Date(year, month - 1, day);
    const adminAssigned = await adminEntity.findById(idAdmin);
    const nameAdminAssigned = `${adminAssigned.fullname}(${adminAssigned.role})`;
    const newJob = await jobEntity.create({
      status: "progress",
      level: levelJob,
      title: titleJob,
      startTime: startTimeJob,
      deadline: deadlineJob,
      assigned: [
        {
          id: idAdmin,
          name: nameAdminAssigned,
        },
      ],
      mapId: titleJob,
      mindmapStructure: {
        nodeData: {
          id: "root",
          topic: titleJob,
          root: true,
          children: [],
        },
      },
    });
    const io = req.app.get("socketio");
    io.emit("update-job", [newJob, admins]);
    res.json({ mess: "Tạo công việc thành công", success: true });
  } catch (error) {
    res.json({
      mess: "Tạo công việc thất bại",
      success: false,
      error: error.message,
    });
  }
};
export const saveMindmap = async (req, res) => {
  try {
    const { payload } = req.body;
    if (!payload || !Array.isArray(payload)) {
      return res.json({ mess: "Mindmap gửi lên không hợp lệ", success: false });
    }
    console.log(payload);
    const bulkOps = payload.map((item) => ({
      updateOne: {
        filter: { mapId: item.mapId },
        update: {
          $set: { mindmapStructure: item.mapStructure },
        },
        upsert: true,
      },
    }));
    await jobEntity.bulkWrite(bulkOps);
    res.json({ mess: "Lưu mindmap thành công", success: true });
  } catch (error) {
    res.json({
      mess: "Lưu mindmap thất bại",
      success: false,
      error: error.message,
    });
  }
};
export const assignAdmin = async (req, res) => {
  try {
    const { idJob, idAssignAdmin } = req.body;
    if (!idAssignAdmin) {
      return res.json({
        mess: "Vui lòng chọn admin cần giao việc",
        success: false,
      });
    }
    const job = await jobEntity.findById(idJob);
    const isAssign = (job.assigned || []).some(
      (item) => item.id.toString() === idAssignAdmin.toString(),
    );
    if (isAssign) {
      return res.json({
        mess: "Admin bạn chọn hiện tại đang xử lý việc này",
        success: false,
      });
    }
    const admin = await adminEntity.findById(idAssignAdmin);
    const nameAdmin = `${admin.fullname}(${admin.role})`;
    let updateJob = "";
    if (!job.assigned[1]) {
      updateJob = await jobEntity.findByIdAndUpdate(
        idJob,
        {
          $push: {
            assigned: [
              {
                id: idAssignAdmin,
                name: nameAdmin,
              },
            ],
          },
        },
        { new: true },
      );
    } else {
      updateJob = await jobEntity.findByIdAndUpdate(
        idJob,
        {
          $set: {
            "assigned.1": [
              {
                id: idAssignAdmin,
                name: nameAdmin,
              },
            ],
          },
        },
        { new: true },
      );
    }
    const io = req.app.get("socketio");
    io.emit("update-job", [updateJob]);
    const data = 1;
    io.emit("updateGeneratedJob", [idAssignAdmin, data]);
    res.json({ mess: "Giao việc thành công", success: true });
  } catch (error) {
    res.json({
      mess: "Giao việc thất bại",
      success: false,
      error: error.message,
    });
  }
};
export const reloadJob = async (req, res) => {
  const { idAdmin } = req.params;
  const adminObjectId = new mongoose.Types.ObjectId(idAdmin);
  const jobAssign = await jobEntity.aggregate([
    { $match: { "assigned.id": adminObjectId } },
    {
      $addFields: {
        priorityOrder: {
          $switch: {
            branches: [
              { case: { $eq: ["$level", "Gấp"] }, then: 1 },
              { case: { $eq: ["$level", "Ưu tiên"] }, then: 2 },
              { case: { $eq: ["$level", "Thong thả"] }, then: 3 },
            ],
            default: 4, // Phòng thủ nếu có trạng thái lạ lọt vào hệ thống
          },
        },
      },
    },
    // Bước 2: Sắp xếp tăng dần theo trọng số (1 -> 2 -> 3) [cite: 2026-01-28]
    {
      $sort: { priorityOrder: 1, createdAt: -1 }, // Nếu cùng mức độ ưu tiên, đơn mới hơn xếp lên trước [cite: 2026-01-28]
    },
    // Bước 3: Xóa bỏ trường tạm 'priorityOrder' trước khi trả về để giữ sạch dữ liệu đầu ra [cite: 2026-01-28]
    {
      $project: { priorityOrder: 0 },
    },
  ]);
  const admins = await adminEntity.find().lean();
  console.log(jobAssign);
  res.json({ jobAssign, admins });
};
export const updateStatusJob = async (req, res) => {
  try {
    const { idJob } = req.params;
    const updateJob = await jobEntity
      .findByIdAndUpdate(
        idJob,
        {
          status: "completed",
          level: "Đã hoàn thành",
        },
        { new: true },
      )
      .lean();
    const io = req.app.get("socketio");
    io.emit("update-job", [updateJob]);
    res.json({
      mess: "Cập nhật tình trạng công việc thành công",
      success: true,
    });
  } catch (error) {
    res.json({
      mess: "Cập nhật tình trạng công việc thất bại",
      success: false,
      error: error.message,
    });
  }
};
export const getUpdateJob = async (req, res) => {
  const { idJob } = req.params;
  const jobUpdate = await jobEntity.findById(idJob);
  res.json({ data: jobUpdate });
};
export const updateJob = async (req, res) => {
  try {
    let { idJob, titleJob, levelJob, startTimeJob, deadlineJob } = req.body;
    const updateJob = await jobEntity
      .findByIdAndUpdate(
        idJob,
        {
          title: titleJob,
          level: levelJob,
          startTime: startTimeJob,
          deadline: deadlineJob,
        },
        { new: true },
      )
      .lean();
    const io = req.app.get("socketio");
    io.emit("update-job", [updateJob]);
    res.json({ mess: "Cập nhật công việc thành công", success: true });
  } catch (error) {
    res.json({
      mess: "Cập nhật c6ng việc thất bại",
      success: false,
      error: error.message,
    });
  }
};
export const deleteJob = async (req, res) => {
  try {
    const { idJob } = req.params;
    const deleteJob = await jobEntity.findByIdAndDelete(idJob);
    const io = req.app.get("socketio");
    io.emit("delete-job", deleteJob);
    res.json({ mess: "Xóa công việc thành công", success: true });
  } catch (error) {
    res.json({
      mess: "Xóa công việc thất bại",
      success: false,
      error: error.message,
    });
  }
};
if (!process.env.VAPID_PUBLIC_KEY && !process.env.VAPID_PRIVATE_KEY) {
  console.error("Lỗi lấy vapid key từ env");
} else {
  try {
    webpush.setVapidDetails(
      "mailto:thienphuc19992003@gmail.com",
      process.env.VAPID_PUBLIC_KEY,
      process.env.VAPID_PRIVATE_KEY,
    );
    console.log("Cấu hình vapid detail thành công");
  } catch (error) {
    console.log("Cấu hình vapid detail thất bại");
  }
}

export const subscribeNotification = async (req, res) => {
  try {
    const { subscription, idAdmin } = req.body;
    await adminEntity.findByIdAndUpdate(idAdmin, {
      pushSubscription: subscription,
    });
    res.json({ mess: "Đã kích hoạt thông báo", success: true });
  } catch (error) {
    res.json({
      mess: "Kích hoạt thông báo thất bại",
      success: false,
      error: error.message,
    });
  }
};
cron.schedule("* * * * *", async () => {
  console.log(
    `[${new Date().toLocaleTimeString()}] Cron Job đang tự động quét các công việc sắp đến deadline`,
  );
  const localNow = new Date();
  const now = new Date(localNow.getTime());
  const oneMinutedLater = new Date(localNow.getTime() + 60000);
  const urgentJobsDL = await jobEntity
    .find({ deadline: { $gte: now, $lte: oneMinutedLater } })
    .populate({ path: "assigned.id", model: "adminEntity" })
    .lean();
  urgentJobsDL.forEach((job) => {
    (job.assigned || []).forEach(async (admin) => {
      const adminId = admin.id;
      if (adminId && adminId.pushSubscription) {
        const payload = JSON.stringify({
          title: `📋 ${job.title}`,
          body: `Đã đến deadline ⏰`,
          icon: "/img/logo_imzai_1.png",
        });
        try {
          await webpush.sendNotification(adminId.pushSubscription, payload);
        } catch (error) {
          console.error(`Không thể đẩy thông báo cho admin`, error.message);
        }
      }
    });
  });
  const urgentJobsST = await jobEntity
    .find({ startTime: { $gte: now, $lte: oneMinutedLater } })
    .populate({ path: "assigned.id", model: "adminEntity" })
    .lean();
  urgentJobsST.forEach((job) => {
    (job.assigned || []).forEach(async (admin) => {
      const adminId = admin.id;
      if (adminId && adminId.pushSubscription) {
        const payload = JSON.stringify({
          title: `📋 ${job.title}`,
          body: `Hãy bắt đầu công việc nào 🥊`,
          icon: "/img/logo_imzai_1_tb.png",
        });
        try {
          await webpush.sendNotification(adminId.pushSubscription, payload);
        } catch (error) {
          console.error(`Không thể đẩy thông báo cho admin`, error.message);
        }
      }
    });
  });
});
