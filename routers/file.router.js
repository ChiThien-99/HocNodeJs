import express from "express";
export const routerFile = express.Router();
import * as fileController from "../controllers/file.controller.js";
const prefix = "/file";
routerFile.get(`${prefix}`, fileController.getFile);
routerFile.get(`${prefix}/download`, fileController.downloadFile);
routerFile.post(`${prefix}/createFile`, fileController.createFile);
