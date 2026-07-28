import express from "express";
import * as dbClientController from "../controllers/dashboardClient.controller.js";
import { validateUpdateClient } from "./middleware/validateUpdateClient.js";
import { authenticateToken2 } from "./middleware/authenticateToken.js";
export const dbClientRouter = express.Router();
const prefix = "/dashboardClient";
dbClientRouter.get(
  `${prefix}/:idClient`,
  dbClientController.getDashboardClient,
);
dbClientRouter.get(
  `${prefix}/mfa/setup`,
  authenticateToken2,
  dbClientController.mfaSetup,
);
dbClientRouter.get(
  `${prefix}/disable/mfa`,
  authenticateToken2,
  dbClientController.disableMfa,
);
dbClientRouter.post(
  `${prefix}/enableMfa`,
  authenticateToken2,
  dbClientController.enableMfa,
);
dbClientRouter.put(
  `${prefix}/updateInfo/:id`,
  validateUpdateClient,
  dbClientController.putInfoClient,
);
