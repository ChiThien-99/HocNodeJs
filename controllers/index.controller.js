import { bannerEntity } from "../models/banner.model.js";
import { notifyEntity } from "../models/notification.model.js";
import { appEntity } from "../models/app.model.js";
export const getIndex = async (req, res) => {
  const banners = await bannerEntity.find().sort("order");
  const notifys = await notifyEntity.find().sort("-createAt");
  const apps = await appEntity.find().limit(6);
  res.render("index.ejs", { banners, notifys, apps });
};
