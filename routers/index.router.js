import express from "express";
import * as indexController from "../controllers/index.controller.js";
export const indexRouter = express.Router();
indexRouter.get("/", indexController.getIndex);
