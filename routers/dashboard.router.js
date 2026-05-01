import express from "express";
export const dashboardRouter = express.Router();
import * as dashboardController from "../controllers/dashboard.controller.js";
import { generalLimit, authLimit } from "./middleware/rateLimiter.js";
import { validateLogin } from "./middleware/validateLogin.js";
const prefix = "/dashboard";
dashboardRouter.get(
  `${prefix}`,
  generalLimit,
  dashboardController.getDashboard,
);
dashboardRouter.post(
  `${prefix}/registerAdmin`,
  authLimit,
  validateLogin,
  dashboardController.postRegisterAdmin,
);
