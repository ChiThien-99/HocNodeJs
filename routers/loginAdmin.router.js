import express from "express";
export const routerLoginAdmin=express.Router();
import * as controllerLoginAdmin from "../controllers/loginAdmin.controller.js";
const prefix="/loginAdmin";
routerLoginAdmin.get(prefix,controllerLoginAdmin.getLoginAdmin)