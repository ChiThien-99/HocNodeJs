import express from "express";
import * as dbClientController from "../controllers/dashboardClient.controller.js";
import { validateUpdateClient } from "./middleware/validateUpdateClient.js";
export const dbClientRouter = express.Router();
const prefix = "/dashboardClient";
dbClientRouter.get(`${prefix}`, dbClientController.getDashboardClient);
dbClientRouter.put(
  `${prefix}/updateInfo/:id`,
  validateUpdateClient,
  dbClientController.putInfoClient,
);
