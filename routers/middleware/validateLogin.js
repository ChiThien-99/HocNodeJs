import { body, validationResult } from "express-validator";
export const validateLogin = [
  body("emailAdmin")
    .isEmail()
    .withMessage("Email không đúng định dạng")
    .normalizeEmail(),
  body("pwAdmin")
    .isLength({ min: 8 })
    .withMessage("Mật khẩu có ít nhất 8 ký tự")
    .matches(/[a-zA-Z]/)
    .withMessage("Mật khẩu phải chứa ít nhất 1 chữ cái")
    .matches(/\d/)
    .withMessage("Mật khẩu phải chứa ít nhất 1 chữ số")
    .matches(/[!@#$%^&*(),.?":{}|<>]/)
    .withMessage("Mật khấu phải chứa ít nhất một ký tự đặc biệt"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array().map((err) => err.msg),
      });
    }
    next();
  },
];
