import { body, validationResult } from "express-validator";
export const validateTelDelivery = [
  body("tel")
    .isMobilePhone("vi-VN")
    .withMessage("Số điện thoại không đúng định dạng")
    .trim(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        mess: errors
          .array()
          .map((err) => err.msg)
          .join("\n"),
      });
    }
    next();
  },
];
