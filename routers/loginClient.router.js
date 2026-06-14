import express from "express";
import * as clientController from "../controllers/loginClient.controller.js";
import { validateRegisterClient } from "./middleware/validateRegisterClient.js";
import { validateLoginClient } from "./middleware/validateLoginClient.js";
import { authLimit } from "./middleware/rateLimiter.js";
export const clientRouter = express.Router();
const prefix = "/loginClient";
clientRouter.post(
  `${prefix}/postClient`,
  validateRegisterClient,
  clientController.postClient,
);
clientRouter.post(
  `${prefix}/login`,
  authLimit,
  validateLoginClient,
  clientController.loginClient,
);
clientRouter.post(`${prefix}/checkOtp`, clientController.checkOtp);
