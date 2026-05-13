import { appEntity } from "../models/app.model.js";
export const getIMZApp1 = async (req, res) => {
  const { id } = req.params;
  await appEntity.findByIdAndUpdate(id, { $inc: { views: 1 } });
  const app = await appEntity.findById(id);
  res.render("app1.ejs", { app });
};
export const getIMZApp2 = async (req, res) => {
  const { id } = req.params;
  await appEntity.findByIdAndUpdate(id, { $inc: { views: 1 } });
  const app = await appEntity.findById(id);
  res.render("app1.ejs", { app });
};
export const getIMZApp3 = async (req, res) => {
  const { id } = req.params;
  await appEntity.findByIdAndUpdate(id, { $inc: { views: 1 } });
  const app = await appEntity.findById(id);
  res.render("app1.ejs", { app });
};
export const getIMZApp4 = async (req, res) => {
  const { id } = req.params;
  await appEntity.findByIdAndUpdate(id, { $inc: { views: 1 } });
  const app = await appEntity.findById(id);
  res.render("app1.ejs", { app });
};
