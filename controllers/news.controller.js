import { newsEntity } from "../models/news.model.js";
import { appEntity } from "../models/app.model.js";
import { deviceEntity } from "../models/device.model.js";
export const getDetailNews = async (req, res) => {
  const { id } = req.params;
  const news = await newsEntity.findById(id);
  const apps = await appEntity.find().sort("-views").limit(4);
  const devices = await deviceEntity.find().sort("-createAt").limit(4);
  const query = {};
  if (news.category) {
    const filterArray = Array.isArray(news.category)
      ? news.category
      : [news.category];
    query.category = { $in: filterArray };
  }
  const relatedNews = await newsEntity.find(query).sort("-createAt").limit(4);
  const latestNews = await newsEntity.find().sort("-createAt").limit(4);

  res.render("detailNews.ejs", {
    news,
    apps,
    devices,
    relatedNews,
    latestNews,
  });
};
