import { bannerEntity } from "../models/banner.model.js";
import { notifyEntity } from "../models/notification.model.js";
export const getIndex = async (req, res) => {
  const banners = await bannerEntity.find().sort("order");
  const notifys = await notifyEntity.find().sort("-createAt");
  res.render("index.ejs", { banners, notifys });
};
