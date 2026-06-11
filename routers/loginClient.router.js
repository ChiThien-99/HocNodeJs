import express from "express";
import * as clientController from "../controllers/loginClient.controller.js";
import { validateRegisterClient } from "./middleware/validateRegisterClient.js";
export const clientRouter=express.Router();
const prefix="/loginClient";
clientRouter.post(`${prefix}/postClient`,validateRegisterClient,clientController.postClient);