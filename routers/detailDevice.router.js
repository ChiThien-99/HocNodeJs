import express from "express";
import * as detailDeviceController from "../controllers/detailDevice.controller.js";
export const detailDeviceRouter = express.Router();
const prefix="/detailDevice";

detailDeviceRouter.get(`${prefix}/:id`,detailDeviceController.getDetailDevice);
detailDeviceRouter.get(`${prefix}/commentLike/:id`, detailDeviceController.handleLike);
detailDeviceRouter.post(`${prefix}/addComment/:id`, detailDeviceController.postAddComment);
detailDeviceRouter.post(`${prefix}/cart/add`, detailDeviceController.addCart);

