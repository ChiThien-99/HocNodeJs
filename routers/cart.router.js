import express from "express"
import * as cartController from "../controllers/cart.controller.js";
export const cartRouter=express.Router();
const prefix="/cart";
cartRouter.get(`${prefix}/:idClient`,cartController.getCart);
cartRouter.delete(`${prefix}/deleteProduct`,cartController.deleteProduct);
