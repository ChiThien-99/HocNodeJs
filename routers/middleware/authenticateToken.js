import jwt from "jsonwebtoken";
import "dotenv/config";
export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Truy cập bị từ chối, không tìm thấy token xác thực",
    });
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, decodedUser) => {
    if (err) {
      const errMsg =
        err.name === "TokenExpiredError"
          ? "Phiên làm việc đã hết hạn.Vui lòng đăng nhập lại"
          : "Token không hợp lệ hoặc đã bị can thiệp";
      return res.status(403).json({
        success: false,
        message: errMsg,
      });
    }
    req.user = decodedUser;
    next();
  });
};
