import express from "express";
export const routerFile=express.Router();
import * as fileController from "../controllers/file.controller.js";
const prefix="/file";
routerFile.get(`${prefix}/createFile`,fileController.createFile);
