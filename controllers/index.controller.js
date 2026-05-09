import { bannerEntity } from "../models/banner.model.js";
export const getIndex = async (req, res) => {
  const banners=await bannerEntity.find().sort("order");
  res.render("index.ejs",{banners});
};
