import express from "express";
import * as indexController from "../controllers/index.controller.js";
import { validateSubscribers } from "./middleware/validateSubscribers.js";
import { generalLimit } from "./middleware/rateLimiter.js";
export const indexRouter = express.Router();
const prefix = "/index";
indexRouter.get("/", indexController.getIndex);
indexRouter.get(`${prefix}/filterNotify`, indexController.filterTypeNotify);
indexRouter.get(`${prefix}/loginClient`, indexController.loginClient);
indexRouter.post(
  `${prefix}/postProblem`,
  generalLimit,
  indexController.postProblem,
);
indexRouter.post(
  `${prefix}/postSubscribers`,
  generalLimit,
  validateSubscribers,
  indexController.postSubscribers,
);
indexRouter.post(
  `${prefix}/softwareAccess`,
  indexController.handleSoftwareAccess,
);
