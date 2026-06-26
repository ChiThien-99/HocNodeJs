import express from "express";
import * as cartController from "../controllers/cart.controller.js";
import { validateTelDelivery } from "./middleware/validateTelDelivery.js";
export const cartRouter = express.Router();
const prefix = "/cart";
cartRouter.get(`${prefix}/:idClient`, cartController.getCart);
cartRouter.post(`${prefix}/calMultiVouchers`, cartController.calMultiVouchers);
cartRouter.post(
  `${prefix}/filterProvinceWards`,
  cartController.filterProvinceWards,
);
cartRouter.post(
  `${prefix}/addReceivingInfor`,
  validateTelDelivery,
  cartController.addReceivingInfor,
);
cartRouter.post(`${prefix}/addInfoInvoice`, cartController.addInfoInvoice);
cartRouter.put(`${prefix}/updateQuantity`, cartController.updateQuantity);
cartRouter.delete(`${prefix}/deleteProduct`, cartController.deleteProduct);
cartRouter.delete(`${prefix}/deleteAddress`, cartController.deleteAddress);
cartRouter.delete(
  `${prefix}/deleteInvoiceInfor`,
  cartController.deleteInvoiceInfor,
);
