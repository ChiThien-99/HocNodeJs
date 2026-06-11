import { body, validationResult } from "express-validator";
export const validateRegisterClient = [
  body("emailClient")
    .isEmail()
    .withMessage("Email không đúng định dạng")
    .normalizeEmail(),
  body("pwClient")
    .isLength({ min: 8 })
    .withMessage("Mật khẩu có ít nhất 8 ký tự")
    .matches(/[a-zA-Z]/)
    .withMessage("Mật khẩu phải chứa ít nhất 1 chữ cái")
    .matches(/\d/)
    .withMessage("Mật khẩu phải chứa ít nhất 1 chữ số")
    .matches(/[!@#$%^&*(),.?":{}|<>]/)
    .withMessage("Mật khấu phải chứa ít nhất một ký tự đặc biệt"),
 body("telClient")
    .optional({ checkFalsy: true })
    .isMobilePhone("vi-VN")
    .withMessage("Số điện thoại không đúng định dạng")
    .trim(),
 body("dateBirthClient")
    .isISO8601()
    .withMessage("Ngày sinh không đúng định dạng")
    .custom((value)=>{
        const inputDate=new Date(value);
        const currentDate=new Date();
        inputDate.setHours(0,0,0,0);
        currentDate.setHours(0,0,0,0);
        if (inputDate=currentDate) {
            throw new Error("Hôm nay bạn đã vất vả chui ra từ bụng mẹ rồi")
        }
        if (inputDate>currentDate) {
            throw new Error(`Bạn đã quay về quá khứ nay là ${currentDate}`)
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
