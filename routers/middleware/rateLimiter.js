import rateLimit from "express-rate-limit";
export const generalLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    success: false,
    message: "Bạn đã gửi quá nhiều yêu cầu, vui lòng thử lại sau 15 phút",
  },
  standardHeaders: true,
  legacyHeaders: false,
});
export const authLimit = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 20,
  message: {
    success: false,
    message: "Bạn đã gửi quá nhiều yêu cầu, vui lòng thử lại sau 1 tiếng",
  },
  standardHeaders: true,
  legacyHeaders: false,
});
