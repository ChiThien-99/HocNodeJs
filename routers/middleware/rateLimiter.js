import rateLimit from "express-rate-limit";
export const generalLimit = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 100,
  message: {
    success: false,
    mess: "Bạn đã gửi quá nhiều yêu cầu, vui lòng thử lại sau 5 phút",
  },
  standardHeaders: true,
  legacyHeaders: false,
});
export const authLimit = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 5,
  message: {
    success: false,
    mess: "Bạn đã gửi quá nhiều yêu cầu, vui lòng thử lại sau 5 phút",
  },
  standardHeaders: true,
  legacyHeaders: false,
});
