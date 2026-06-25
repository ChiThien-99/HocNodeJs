import express from "express";
import * as cartController from "../controllers/cart.controller.js";
export const cartRouter = express.Router();
const prefix = "/cart";
cartRouter.get(`${prefix}/:idClient`, cartController.getCart);
cartRouter.post(`${prefix}/calMultiVouchers`, cartController.calMultiVouchers);
cartRouter.post(`${prefix}/filterProvinceWards`, cartController.filterProvinceWards);
cartRouter.put(`${prefix}/updateQuantity`, cartController.updateQuantity);
cartRouter.delete(`${prefix}/deleteProduct`, cartController.deleteProduct);
