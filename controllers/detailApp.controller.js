import { appEntity } from "../models/app.model.js";
export const getDetailApp = async (req, res) => {
  const { id } = req.params;
   if (!req.session.viewedApp) {
      req.session.viewedApp = [];
    }
    if (!req.session.viewedApp.includes(id)) {
      await appEntity.findByIdAndUpdate(id, { $inc: { views: 1 } });
      req.session.viewedApp.push(id);
    }
  const app = await appEntity.findById(id);
  res.render("detailApp.ejs", { app });
};
