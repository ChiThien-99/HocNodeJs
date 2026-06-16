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
    const { nameApp, infoApp, funcApp, optionPrice, priceLEApp, priceSIApp } =
      req.body;
    let priceLE = "";
    let priceSI = "";
    if (optionPrice === "Miễn phí") {
      priceLE = "Miễn phí";
      priceSI = "Miễn phí";
    } else {
      priceLE = priceLEApp;
      priceSI = priceSIApp;
    }
    const updateApp = await appEntity.findByIdAndUpdate(
      id,
      {
        image: image,
        cloudinary_id: cloudinary_id,
        name: nameApp,
        info: infoApp,
        priceLE: priceLEApp,
        priceSI: priceSIApp,
        func: funcApp,
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
      priceLE: priceLEDeviceActual,
      priceSI: priceSIDeviceActual,
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
      priceActual,
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
        price: priceActual,
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
