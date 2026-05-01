import express from "express";
export const routerLoginAdmin = express.Router();
import * as controllerLoginAdmin from "../controllers/loginAdmin.controller.js";
import { generalLimit, authLimit } from "./middleware/rateLimiter.js";
import { validateLogin } from "./middleware/validateLogin.js";
import { authenticateToken } from "./middleware/authenticateToken.js";
const prefix = "/loginAdmin";
routerLoginAdmin.get(prefix, generalLimit, controllerLoginAdmin.getLoginAdmin);
routerLoginAdmin.post(
  `${prefix}`,
  authLimit,
  validateLogin,
  authenticateToken,
  controllerLoginAdmin.postLoginAdmin,
);
