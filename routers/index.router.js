import express from "express";
import * as indexController from "../controllers/index.controller.js";
export const indexRouter = express.Router();
const prefix="/index"
indexRouter.get("/", indexController.getIndex);
indexRouter.get(`${prefix}/filter/newApp`,indexController.filterNewApp);
indexRouter.get(`${prefix}/filter/popularApp`,indexController.filterPopularApp);
indexRouter.get(`${prefix}/filter/funcApp`,indexController.filterFuncApp);
indexRouter.get(`${prefix}/filterNotify`,indexController.filterTypeNotify);
