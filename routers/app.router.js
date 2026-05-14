import express from "express";
import * as appController from "../controllers/app.controller.js";
export const appRouter=express.Router();
const prefix="/allapp";
appRouter.get(`${prefix}`,appController.getAllApp)