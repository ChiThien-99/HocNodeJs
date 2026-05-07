import express from "express";
export const dashboardRouter = express.Router();
import * as dashboardController from "../controllers/dashboard.controller.js";
import { generalLimit, authLimit } from "./middleware/rateLimiter.js";
import { validate } from "./middleware/validate.js";
import { authenticateToken } from "./middleware/authenticateToken.js";
import { checkTokens } from "./middleware/checkTokens.js";
const prefix = "/dashboard";
dashboardRouter.get(
  `${prefix}`,
  generalLimit,
  checkTokens,
  dashboardController.getDashboard,
);
dashboardRouter.get(
  `${prefix}/getUserAdmin/:id`,
  dashboardController.getUserAdminById,
);
dashboardRouter.post(
  `${prefix}/registerAdmin`,
  authLimit,
  validate,
  dashboardController.postRegisterAdmin,
);
dashboardRouter.put(`${prefix}/updateAdmin/:idUpdate`,authenticateToken,dashboardController.putUpdateAdminById)
dashboardRouter.put(`${prefix}/updatePWAdmin/:idUpdate`,authenticateToken,dashboardController.putUpdatePWAdmin)
dashboardRouter.delete(`${prefix}/deleteUserAdmin/:idDelete`,authenticateToken,dashboardController.deleteUserAdminById)
