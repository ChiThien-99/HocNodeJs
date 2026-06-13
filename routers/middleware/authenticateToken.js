import jwt from "jsonwebtoken";
import "dotenv/config";
export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const tokenFromHeader = authHeader && authHeader.split(" ")[1];
  const tokenFromCookie=req.cookies?req.cookies.accessToken:null;
  const token=tokenFromHeader||tokenFromCookie;
  console.log(`Token: ${token}`);
  if (!token) {
    return res.status(401).json({success:false,mess:"Không tìm thấy token"});
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
export const authenticateToken2 = (req, res, next) => {
  const authHeader = req.headers["Authorization"];
  const tokenFromHeader = authHeader && authHeader.split(" ")[1];
  const tokenFromCookie=req.cookies?req.cookies.accessToken2:null;
  const token=tokenFromHeader||tokenFromCookie;
  console.log(`Token: ${token}`);
  if (!token) {
    return res.status(401).json({success:false,mess:"Không tìm thấy token"});
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
