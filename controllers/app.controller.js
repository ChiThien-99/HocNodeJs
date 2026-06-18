import { blogsEntity } from "../models/blogs.model.js";
import { appEntity } from "../models/app.model.js";
import { deviceEntity } from "../models/device.model.js";
import { funcAppEntity } from "../models/funcApp.model.js";
import { bannerEntity } from "../models/banner.model.js";

export const getAllApp = async (req, res) => {
  const funcApp = await funcAppEntity.find().sort("-createAt");
  const devices = await deviceEntity.find().sort("-createAt").limit(4);
  const blogs = await blogsEntity.find().sort("-createAt").limit(4);
  const limit = 12;
  const currentPage = parseInt(req.query.page) || 1;
  const currentFunc = req.query.func || "";
  const sort = req.query.sort || "createAt";
  const charge=req.query.charge || "";
  const query = {};
  let filterArray = [];
  if (currentFunc) {
    filterArray = Array.isArray(currentFunc)
      ? currentFunc
      : currentFunc.split(",");
    query.func = { $all: filterArray };
  }
  if (charge==="charge") {
    query.priceLE={$ne:"Miễn phí"};
  }
  if (charge==="freeCharge") {
    query.priceLE="Miễn phí";
  }
  const skip = (currentPage - 1) * limit;
  const [appList, appTotal] = await Promise.all([
    appEntity.find(query).sort(`-${sort}`).skip(skip).limit(limit),
    appEntity.countDocuments(query),
  ]);
  const totalPage = Math.ceil(appTotal / limit);
  const banners = await bannerEntity.find({ page: "app" });
  res.render("app.ejs", {
    funcApp,
    devices,
    blogs,
    appList,
    currentPage,
    totalPage,
    currentFunc: currentFunc || "",
    sort,
    charge,
    banners,
  });
};
