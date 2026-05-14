import express from "express";
import * as app1Controller from "../controllers/app1.controller.js";
export const app1Router=express.Router();
const prefix="/app";
app1Router.get(`${prefix}/IMZ_APP_01/:id`,app1Controller.getIMZApp1);
app1Router.get(`${prefix}/IMZ_APP_02/:id`,app1Controller.getIMZApp2);
app1Router.get(`${prefix}/IMZ_APP_03/:id`,app1Controller.getIMZApp3);
app1Router.get(`${prefix}/IMZ_APP_04/:id`,app1Controller.getIMZApp4);
