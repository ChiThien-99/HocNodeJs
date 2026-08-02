import express from "express";
import * as authController from "../controllers/auth.controller.js";
import {
  authenticateToken,
  authenticateToken2,
} from "./middleware/authenticateToken.js";
export const authRouter = express.Router();
const prefix = "/api";
authRouter.get(`${prefix}/auth/me`, authenticateToken, authController.getme);
authRouter.post(`${prefix}/auth/refresh`, authController.authTokens);
authRouter.get("/api/auth/me2", authenticateToken2, authController.getme2);
authRouter.post("/api/auth/refresh2", authController.authTokens2);
authRouter.post(`${prefix}/auth/logout`, authController.logout);
authRouter.post(
  `${prefix}/auth/logoutDB`,
  authenticateToken,
  authController.logoutDB,
);
