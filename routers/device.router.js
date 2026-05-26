import express from "express";
import * as deviceController from "../controllers/device.controller.js";
export const deviceRouter=express.Router();
const prefix="/device";
deviceRouter.get(`${prefix}`,deviceController.getDevice);
