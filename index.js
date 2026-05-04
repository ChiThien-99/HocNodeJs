import { fileURLToPath } from "url";
import { dirname } from "path";

// Khôi phục __filename và __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Bây giờ bạn có thể sử dụng __dirname bình thường
// Ví dụ: express.static(path.join(__dirname, "publics"), { ... });
import express from "express";
import cors from "cors";
import crypto from "crypto";
import https from "https";
import fs from "fs";
import path from "path";
import helmet from "helmet";
import * as jwt from "jsonwebtoken";
import { connectDB } from "./database.js";
connectDB();
const app = express();
import { routerTodo } from "./routers/todo.router.js";
import { routerFile } from "./routers/file.router.js";
import { dashboardRouter } from "./routers/dashboard.router.js";
import { routerLoginAdmin } from "./routers/loginAdmin.router.js";
import cookieParser from "cookie-parser";

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        ...helmet.contentSecurityPolicy.getDefaultDirectives(),
        "script-src": [
          "'self'",
          "'unsafe-inline'",
          "https://kit.fontawesome.com",
          "https://cdn.jsdelivr.net",
        ],
        "connect-src": [
          "'self'",
          "https://ka-f.fontawesome.com",
          "https://cdn.jsdelivr.net",
        ],
      },
    },
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    exposedHeaders: [
      "ratelimit-limit",
      "ratelimit-remaining",
      "ratelimit-reset",
    ],
    allowedHeaders: ["Authorization", "Content-Type"],
  }),
);
// Cấu hình file public
app.use(
  express.static(path.join(__dirname, "publics"), {
    dotfiles: "ignore",
    etag: true,
    maxAge: "1d",
    redirect: true,
  }),
);

app.set("view engine", "ejs");
app.set("views", "./views");

app.get("/", (req, res) => {
  res.send(
    `<h1>Welcome to Secure Express Server</h1>\n<h2>Trang chủ IMZ.AI</h2>`,
  );
});

app.get("/api/status", (req, res) => {
  res.json({
    status: "operational",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
    nodeVersion: process.version,
  });
});
app.use("/", routerTodo);
app.use("/", routerFile);
app.use("/", dashboardRouter);
app.use("/", routerLoginAdmin);
app.post("/api/auth/refresh", async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    res.status(401).json("Chưa đăng nhập");
  }
  const admin = await adminEntity.findOne({ refreshToken: refreshToken });
  if (!admin) {
    res.status(403).json("Refresh Token không hợp lệ");
  }
  jwt.verify(refreshToken, process.env.REFRESH_SECRET, (err, decodes) => {
    if (err) {
      res.status(403).json("Token đã hết hạn hoặc sai");
    }
    const newAccessToken = jwt.sign(
      {
        fullname: admin.fullname,
        role: admin.role,
        email: admin.email,
        decent: admin.decent,
      },
      process.env.ACCESS_SECRET,
      { expiresIn: "15m" },
    );
    res.json({ accessToken: newAccessToken });
  });
});
// Xử lý lỗi middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});
//Xử lý lỗi 404
app.use((req, res) => {
  res.status(404).json({ error: "Not Found" });
});

const sslOption = {
  key: fs.readFileSync(path.join(__dirname, "server.key")),
  cert: fs.readFileSync(path.join(__dirname, "server.cert")),
  allowHTTP1: true,
  ticketKeys: crypto.randomBytes(48),
  minVersion: "TLSv1.2",
  ciphers: [
    "TLS_AES_256_GCM_SHA384",
    "TLS_CHACHA20_POLY1305_SHA256",
    "TLS_AES_128_GCM_SHA256",
    "ECDHE-RSA-AES128-GCM-SHA256",
    "!DSS",
    "!aNULL",
    "!eNULL",
    "!EXPORT",
    "!DES",
    "!RC4",
    "!3DES",
    "!MD5",
    "!PSK",
  ].join(":"),
  honorCipherOrder: true,
};
const port = process.env.PORT || 3000;
const server = https.createServer(sslOption, app);
process.on("unhandledRejection", (reason, promise) => {
  console.error(`Unhandle Rejection ${promise}, reason ${reason}`);
});
process.on("uncaughtException", (error) => {
  console.error(`Uncaught Exception ${error}`);
  process.exit(1);
});
const gracefulShutdown = (signal) => {
  console.log(`Received ${signal}.Shutting down gracefully...`);
  server.close(() => {
    console.log("Server Closed");
    process.exit(0);
  });
  setTimeout(() => {
    console.error("Forcing shutdown");
    process.exit(1);
  }, 10000);
};
process.on("SIGTERM", gracefulShutdown);
process.on("SIGINT", gracefulShutdown);

const host = process.env.HOST || "localhost";
server.listen(port, host, () => {
  console.log(`Server running at https://${host}:${port}`);
  console.log("Environment", process.env.NODE_ENV || "development");
  console.log("Press Ctrl+C to stop the server");
});
