import express from "express";
import * as authController from "../controllers/auth.controller.js";
import { authenticateToken } from "./middleware/authenticateToken.js";
export const authRouter=express.Router();
const prefix="/api"
authRouter.get(`${prefix}/auth/me`,authenticateToken,authController.getme);
authRouter.post(`${prefix}/auth/refresh`,authController.authTokens);
