import express from "express";
import * as indexController from "../controllers/index.controller.js";
export const indexRouter = express.Router();
const prefix="/index"
indexRouter.get("/", indexController.getIndex);
indexRouter.get(`${prefix}/filter/newApp`,indexController.filterNewApp);
indexRouter.get(`${prefix}/filter/popularApp`,indexController.filterPopularApp);
indexRouter.get(`${prefix}/filter/funcApp`,indexController.filterFuncApp);
indexRouter.get(`${prefix}/filterNotify`,indexController.filterTypeNotify);
indexRouter.get(`${prefix}/filter/newDevice`,indexController.filterNewDevice);
indexRouter.get(`${prefix}/filter/priceLowHigh`,indexController.filterPriceLowHigh);
indexRouter.get(`${prefix}/filter/priceHighLow`,indexController.filterPriceHighLow);
indexRouter.get(`${prefix}/filter/funcDevice`,indexController.filterFuncDevice);
indexRouter.get(`${prefix}/filter/categoryNews`,indexController.filterCategoryNews);
