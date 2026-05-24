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
dashboardRouter.get(
  `${prefix}/updateNotify/:id`,
  dashboardController.getUpdateNotify,
);
dashboardRouter.get(
  `${prefix}/updateFuncApp/:id`,
  dashboardController.getupdateFuncApp,
);
dashboardRouter.get(
  `${prefix}/updateApp/:id`,
  dashboardController.getUpdateApp,
);
dashboardRouter.get(
  `${prefix}/updateFuncDevice/:id`,
  dashboardController.getUploadFuncDevice,
);
dashboardRouter.get(
  `${prefix}/updateDevice/:id`,
  dashboardController.getUpdateDevice,
);
dashboardRouter.get(
  `${prefix}/updateCategoryblogs/:id`,
  dashboardController.getUpdateCategoryblogs,
);
dashboardRouter.get(
  `${prefix}/updateblogs/:id`,
  dashboardController.getUpdateblogs,
);
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
dashboardRouter.post(
  `${prefix}/listFuncApp`,
  authenticateToken,
  dashboardController.addListFuncApp,
);
dashboardRouter.post(
  `${prefix}/addApp`,
  authenticateToken,
  upload.single("imgApp"),
  dashboardController.addApp,
);
dashboardRouter.post(
  `${prefix}/listFuncDevice`,
  authenticateToken,
  dashboardController.addListFuncDevice,
);
dashboardRouter.post(
  `${prefix}/addDevice`,
  authenticateToken,
  upload.single("imgDevice"),
  dashboardController.addDevice,
);
dashboardRouter.post(
  `${prefix}/addCategoryblogs`,
  dashboardController.addCategoryblogs,
);
dashboardRouter.post(
  `${prefix}/addblogs`,
  authenticateToken,
  upload.single("imgblogs"),
  dashboardController.addblogs,
);
dashboardRouter.post(
  `${prefix}/uploadImageblogs`,
  authenticateToken,
  upload.single("imgblogs"),
  dashboardController.uploadImageblogs,
);
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
dashboardRouter.put(
  `${prefix}/updateNotify/:id`,
  authenticateToken,
  dashboardController.putUpdateNotify,
);
dashboardRouter.put(
  `${prefix}/updateFuncApp/:id`,
  authenticateToken,
  dashboardController.putUpdateFuncApp,
);
dashboardRouter.put(
  `${prefix}/updateApp/:id`,
  authenticateToken,
  upload.single("imgApp"),
  dashboardController.putUpdateApp,
);
dashboardRouter.put(
  `${prefix}/updateFuncDevice/:id`,
  authenticateToken,
  dashboardController.putUpdateFuncDevice,
);
dashboardRouter.put(
  `${prefix}/updateDevice/:id`,
  authenticateToken,
  upload.single("imgDevice"),
  dashboardController.putUpdateDevice,
);
dashboardRouter.put(
  `${prefix}/updateCategoryblogs/:id`,
  dashboardController.putUpdateCategoryblogs,
);
dashboardRouter.put(
  `${prefix}/updateblogs/:id`,
  authenticateToken,
  upload.single("imgblogs"),
  dashboardController.putUpdateblogs,
);
dashboardRouter.delete(
  `${prefix}/deleteUserAdmin/:idDelete`,
  authenticateToken,
  dashboardController.deleteUserAdminById,
);
dashboardRouter.delete(
  `${prefix}/deleteBanner/:id`,
  authenticateToken,
  dashboardController.deleteBanner,
);
dashboardRouter.delete(
  `${prefix}/deleteNotify/:id`,
  authenticateToken,
  dashboardController.deleteNotify,
);
dashboardRouter.delete(
  `${prefix}/deleteFuncApp/:id`,
  authenticateToken,
  dashboardController.deleteFuncApp,
);
dashboardRouter.delete(
  `${prefix}/deleteApp/:id`,
  authenticateToken,
  dashboardController.deleteApp,
);
dashboardRouter.delete(
  `${prefix}/deleteFuncDevice/:id`,
  authenticateToken,
  dashboardController.deleteFuncDevice,
);
dashboardRouter.delete(
  `${prefix}/deleteDevice/:id`,
  authenticateToken,
  dashboardController.deleteDevice,
);
dashboardRouter.delete(
  `${prefix}/deleteCategoryblogs/:id`,
  dashboardController.deleteCategoryblogs,
);
dashboardRouter.delete(
  `${prefix}/deleteblogs/:id`,
  dashboardController.deleteblogs,
);
