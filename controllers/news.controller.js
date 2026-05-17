import { newsEntity } from "../models/news.model.js";
export const getDetailNews = async (req, res) => {
  const { id } = req.params;
  const news = await newsEntity.findById(id);
  res.render("detailNews.ejs", { news });
};
