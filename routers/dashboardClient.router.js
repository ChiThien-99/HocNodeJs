import express from "express";
import * as dbClientController from "../controllers/dashboardClient.controller.js";
export const dbClientRouter=express.Router();
const prefix="/dashboardClient";
dbClientRouter.get(`${prefix}`,dbClientController.getDashboardClient)
