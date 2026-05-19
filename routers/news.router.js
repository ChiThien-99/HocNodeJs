import express from "express";
import * as newsController from "../controllers/news.controller.js";
export const newsRouter = express.Router();
const prefix = "/news";

newsRouter.get(`${prefix}/detailNews/:id`, newsController.getDetailNews);
newsRouter.get(`${prefix}/commentLike/:id`,newsController.handleLike);
newsRouter.post(`${prefix}/addComment/:id`,newsController.postAddComment);

