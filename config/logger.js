import "dotenv/config";
import winston from "winston";
import { Logtail } from "@logtail/node";
import { LogtailTransport } from "@logtail/winston";

const logFormat = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.printf(({ timestamp, level, message }) => {
    return `[${timestamp}] [${level.toUpperCase()}]: ${message}`;
  }),
);
const transports = [];
if (process.env.LOGTAIL_SOURCE_TOKEN) {
  const logtail = new Logtail(process.env.LOGTAIL_SOURCE_TOKEN, {
    endpoint: "https://s2640015.eu-central-1a.betterstackdata.com",
  });
  transports.push(new LogtailTransport(logtail));
} else {
  transports.push(
    new winston.transports.Console({
      format: winston.format.combine(winston.format.colorize(), logFormat),
    }),
  );
  console.warn(
    "Không tim thấy LOGTAIL_SOURCE_TOKEN trong .env, ứng dụng chỉ ghi log cục bộ",
  );
}

const logger = winston.createLogger({
  level: process.env.NODE_ENV === "prod" ? "info" : "debug",
  transports: transports,
});
export default logger;
