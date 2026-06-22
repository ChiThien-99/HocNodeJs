import express from "express";
import * as dbClientController from "../controllers/dashboardClient.controller.js";
import { validateUpdateClient } from "./middleware/validateUpdateClient.js";
import { authenticateToken2 } from "./middleware/authenticateToken.js";
export const dbClientRouter = express.Router();
const prefix = "/dashboardClient";
dbClientRouter.get(
  `${prefix}`,
  authenticateToken2,
  dbClientController.getDashboardClient,
);
dbClientRouter.put(
  `${prefix}/updateInfo/:id`,
  validateUpdateClient,
  dbClientController.putInfoClient,
);
