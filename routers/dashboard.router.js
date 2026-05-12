import express from "express";
export const dashboardRouter = express.Router();
import * as dashboardController from "../controllers/dashboard.controller.js";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import path from "path";
import { generalLimit, authLimit } from "./middleware/rateLimiter.js";
import { validate } from "./middleware/validate.js";
import { authenticateToken } from "./middleware/authenticateToken.js";
import { checkTokens } from "./middleware/checkTokens.js";
const prefix = "/dashboard";
cloudinary.config({
  cloud_name: "doigxmzte",
  api_key: "976469476164149",
  api_secret: "pKqVvE8bbqakSRcCQZAjOXqA0oE",
});
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "imz-banners",
    allowed_formats: ["webp"],
    transformation: [{ crop: "limit" }],
  },
});
const upload = multer({ storage: storage });
dashboardRouter.get(
  `${prefix}`,
  generalLimit,
  checkTokens,
  dashboardController.getDashboard,
);
dashboardRouter.get(
  `${prefix}/getUserAdmin/:id`,
  dashboardController.getUserAdminById,
);
dashboardRouter.get(
  `${prefix}/updateBanner/:id`,
  dashboardController.getBannerById,
);
dashboardRouter.get(`${prefix}/updateNotify/:id`,dashboardController.getUpdateNotify);
dashboardRouter.get(`${prefix}/updateFuncApp/:id`,dashboardController.getupdateFuncApp);
dashboardRouter.post(
  `${prefix}/registerAdmin`,
  authLimit,
  validate,
  dashboardController.postRegisterAdmin,
);
dashboardRouter.post(
  `${prefix}/banner/add`,
  authenticateToken,
  upload.single("imageBanner"),
  dashboardController.postBanner,
);
dashboardRouter.post(
  `${prefix}/addNotify`,
  authenticateToken,
  dashboardController.addNotify,
);
dashboardRouter.post(`${prefix}/listFuncApp`,dashboardController.addListFuncApp)
dashboardRouter.put(
  `${prefix}/updateAdmin/:idUpdate`,
  authenticateToken,
  dashboardController.putUpdateAdminById,
);
dashboardRouter.put(
  `${prefix}/updatePWAdmin/:idUpdate`,
  authenticateToken,
  dashboardController.putUpdatePWAdmin,
);
dashboardRouter.put(
  `${prefix}/updateBanner/:id`,
  authenticateToken,
  upload.single("imageBanner"),
  dashboardController.putUpdateBanner,
);
dashboardRouter.put(`${prefix}/updateNotify/:id`,dashboardController.putUpdateNotify)
dashboardRouter.delete(
  `${prefix}/deleteUserAdmin/:idDelete`,
  authenticateToken,
  dashboardController.deleteUserAdminById,
);
dashboardRouter.put(`${prefix}/updateFuncApp/:id`,dashboardController.putUpdateFuncApp)
dashboardRouter.delete(
  `${prefix}/deleteBanner/:id`,
  authenticateToken,
  dashboardController.deleteBanner,
);
dashboardRouter.delete(`${prefix}/deleteNotify/:id`,dashboardController.deleteNotify)
