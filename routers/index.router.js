import express from "express";
import * as indexController from "../controllers/index.controller.js";
export const indexRouter = express.Router();
const prefix = "/index";
indexRouter.get("/", indexController.getIndex);
indexRouter.get(`${prefix}/filterNotify`, indexController.filterTypeNotify);
indexRouter.post(`${prefix}/postProblem`, indexController.postProblem);
indexRouter.post(`${prefix}/postSubscribers`, indexController.postSubscribers);

