import { carouselEntity } from "../models/carousel.model.js";
import { notifyEntity } from "../models/notification.model.js";
import { appEntity } from "../models/app.model.js";
import { funcAppEntity } from "../models/funcApp.model.js";
import { funcDeviceEntity } from "../models/funcDevice.model.js";
import { deviceEntity } from "../models/device.model.js";
import { categoryblogsEntity } from "../models/categoryblogs.model.js";
import { blogsEntity } from "../models/blogs.model.js";
export const getIndex = async (req, res) => {
  const carousels = await carouselEntity.find().sort("order");
  const notifys = await notifyEntity.find().sort("-createAt");
  const apps = await appEntity.find().sort("-createAt").limit(4);
  const funcApps = await funcAppEntity.find();
  const devices = await deviceEntity.find().sort("-createAt").limit(4);
  const funcDevices = await funcDeviceEntity.find();
  const listCategoryblogs = await categoryblogsEntity.find();
  const listblogs = await blogsEntity.find().sort("-createAt").limit(6);
  res.render("index.ejs", {
    carousels,
    notifys,
    apps,
    funcApps,
    devices,
    funcDevices,
    listblogs,
    listCategoryblogs,
  });
};

export const filterTypeNotify = async (req, res) => {
  try {
    const { type } = req.query;
    const query = {};
    if (type && type !== "all") {
      query.type = type;
    }
    const io = req.app.get("socketio");
    const allNotify = await notifyEntity.find(query).sort("-createAt");
    io.emit("update-notify", allNotify);
    res.json({ mess: "Lọc type notify thành công", success: true });
  } catch (error) {
    res.json({
      mess: "Lọc type notify thất bại",
      success: false,
      error: error.message,
    });
  }
};
