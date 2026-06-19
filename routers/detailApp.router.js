import express from "express";
import * as detailAppController from "../controllers/detailApp.controller.js";
export const detailAppRouter = express.Router();
const prefix = "/detailApp";
detailAppRouter.get(`${prefix}/:id`, detailAppController.getDetailApp);
detailAppRouter.get(`${prefix}/cart/count`, detailAppController.countCart);
detailAppRouter.post(`${prefix}/cart/add`, detailAppController.addCart);

