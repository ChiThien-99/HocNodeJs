import express from "express";
export const routerLoginAdmin = express.Router();
import * as controllerLoginAdmin from "../controllers/loginAdmin.controller.js";
import { generalLimit, authLimit } from "./middleware/rateLimiter.js";
import { validate } from "./middleware/validate.js";
const prefix = "/loginAdmin";
routerLoginAdmin.get(`${prefix}`, generalLimit, controllerLoginAdmin.getLoginAdmin);
routerLoginAdmin.post(
  `${prefix}/login`,
  authLimit,
  validate,
  controllerLoginAdmin.postLoginAdmin,
);
