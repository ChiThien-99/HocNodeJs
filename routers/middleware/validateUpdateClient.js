import { body, validationResult } from "express-validator";
import { clientEntity } from "../../models/client.model.js";
export const validateUpdateClient = [
  body("email")
    .isEmail()
    .withMessage("Email không đúng định dạng")
    .normalizeEmail(),
  body("currentPw")
    .optional({ checkFalsy: true })
    .isLength({ min: 8 })
    .withMessage("Mật khẩu có ít nhất 8 ký tự")
    .matches(/[a-zA-Z]/)
    .withMessage("Mật khẩu phải chứa ít nhất 1 chữ cái")
    .matches(/\d/)
    .withMessage("Mật khẩu phải chứa ít nhất 1 chữ số")
    .matches(/[!@#$%^&*(),.?":{}|<>]/)
    .withMessage("Mật khấu phải chứa ít nhất một ký tự đặc biệt"),
  body("newPw")
    .optional({ checkFalsy: true })
    .isLength({ min: 8 })
    .withMessage("Mật khẩu có ít nhất 8 ký tự")
    .matches(/[a-zA-Z]/)
    .withMessage("Mật khẩu phải chứa ít nhất 1 chữ cái")
    .matches(/\d/)
    .withMessage("Mật khẩu phải chứa ít nhất 1 chữ số")
    .matches(/[!@#$%^&*(),.?":{}|<>]/)
    .withMessage("Mật khấu phải chứa ít nhất một ký tự đặc biệt"),
  body("tel")
    .optional({ checkFalsy: true })
    .isMobilePhone("vi-VN")
    .withMessage("Số điện thoại không đúng định dạng")
    .trim(),
  body("dateBirth")
    .matches(/^(\d{2})\/(\d{2})\/(\d{4})$/)
    .withMessage("Chưa đúng định dạng dd/mm/yyyy")
    .custom((value) => {
      const [day, month, year] = value.split("/");
      const inputDate = new Date(year, month - 1, day);
      const currentDate = new Date();
      inputDate.setHours(0, 0, 0, 0);
      currentDate.setHours(0, 0, 0, 0);
      if (+inputDate === +currentDate) {
        throw new Error(
          "Hôm nay bạn được sinh ra đời\u{1F47C}\nKiểm tra lại ngày/tháng/năm sinh của bạn nhé",
        );
      } else if (+inputDate > +currentDate) {
        throw new Error(
          "Bạn đã quay về quá khứ\u{1F9DA}\nKiểm tra lại ngày/tháng/năm sinh của bạn nhé",
        );
      }
      return true;
    }),
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
