import express from "express";
import * as blogsController from "../controllers/blogs.controller.js";
export const blogsRouter = express.Router();
const prefix = "/blogs";

blogsRouter.get(`${prefix}`, blogsController.getBlogs);
blogsRouter.get(`${prefix}/detailBlog/:id`, blogsController.getDetailblogs);
blogsRouter.get(`${prefix}/commentLike/:id`, blogsController.handleLike);
blogsRouter.post(`${prefix}/addComment/:id`, blogsController.postAddComment);
