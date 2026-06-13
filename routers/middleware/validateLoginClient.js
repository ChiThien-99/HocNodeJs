import { body, validationResult } from "express-validator";
export const validateLoginClient = [
  body("emailClient2")
    .isEmail()
    .withMessage("Email không đúng định dạng")
    .normalizeEmail(),
  body("pwClient2")
    .isLength({ min: 8 })
    .withMessage("Mật khẩu có ít nhất 8 ký tự")
    .matches(/[a-zA-Z]/)
    .withMessage("Mật khẩu phải chứa ít nhất 1 chữ cái")
    .matches(/\d/)
    .withMessage("Mật khẩu phải chứa ít nhất 1 chữ số")
    .matches(/[!@#$%^&*(),.?":{}|<>]/)
    .withMessage("Mật khấu phải chứa ít nhất một ký tự đặc biệt"),
  body("rememberMe")
    .optional()
    .isBoolean()
    .withMessage("Dữ liệu rememberMe phải là kiểu true/false"),
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
