import express from "express";
export const dashboardRouter = express.Router();
import * as dashboardController from "../controllers/dashboard.controller.js";
import { generalLimit, authLimit } from "./middleware/rateLimiter.js";
import { validate } from "./middleware/validate.js";
import { authenticateToken } from "./middleware/authenticateToken.js";
const prefix = "/dashboard";
dashboardRouter.get(
  `${prefix}`,
  generalLimit,
  authenticateToken,
  dashboardController.getDashboard,
);
dashboardRouter.post(
  `${prefix}/registerAdmin`,
  authLimit,
  validate,
  dashboardController.postRegisterAdmin,
);
