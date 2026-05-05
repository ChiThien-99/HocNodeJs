import jwt from "jsonwebtoken";
import "dotenv/config";
export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  let token = authHeader && authHeader.split(" ")[1];
  console.log(`Token: ${token}`);
  if (!token) {
    return res.status(401).json({
      success: false,
      mess: "Truy cập bị từ chối, không tìm thấy token xác thực",
    });
  }
  jwt.verify(token, process.env.ACCESS_SECRET, (err, decodedUser) => {
    if (err) {
      const errMsg =
        err.name === "TokenExpiredError"
          ? "Phiên làm việc đã hết hạn.Vui lòng đăng nhập lại"
          : "Token không hợp lệ hoặc đã bị can thiệp";
      return res.status(401).json({
        success: false,
        mess: errMsg,
      });
    }
    req.user = decodedUser;
    console.log(decodedUser);
    next();
  });
};
