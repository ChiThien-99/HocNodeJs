import express from "express";
import * as blogsController from "../controllers/news.controller.js";
export const newsRouter = express.Router();
const prefix = "/blogs";

newsRouter.get(`${prefix}`,blogsController.getBlogs);
newsRouter.get(`${prefix}/newBlogs`,blogsController.getNewBlogs);
newsRouter.get(`${prefix}/viewsBlogs`,blogsController.getViewsBlogs);
newsRouter.get(`${prefix}/detailBlog/:id`, blogsController.getDetailNews);
newsRouter.get(`${prefix}/commentLike/:id`,blogsController.handleLike);
newsRouter.post(`${prefix}/addComment/:id`,blogsController.postAddComment);

