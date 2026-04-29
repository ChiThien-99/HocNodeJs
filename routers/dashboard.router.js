import express from "express";
export const dashboardRouter=express.Router();
import * as dashboardController from "../controllers/dashboard.controller.js";
const prefix="/dashboard";
dashboardRouter.get(`${prefix}`,dashboardController.getDashboard)