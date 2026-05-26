import express from "express";
import * as detailAppController from "../controllers/detailApp.controller.js";
export const detailAppRouter = express.Router();
const prefix = "/detailApp";
detailAppRouter.get(`/detailApp/:id`, detailAppController.getDetailApp);
