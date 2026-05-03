import os from "os";
import { json } from "stream/consumers";
import { adminEntity } from "../models/admin.model.js";
import bcrypt from "bcryptjs";
function getSystemInfo() {
  const info = {
    os: {
      type: os.type(),
      platform: os.platform(),
      architecture: os.arch(),
      release: os.release(),
      hostname: os.hostname(),
      uptime: formatUptime(os.uptime()),
    },
    user: {
      username: os.userInfo().username,
      homedir: os.homedir(),
      tempdir: os.tmpdir(),
    },
    memory: {
      total: formatByte(os.totalmem()),
      free: formatByte(os.freemem()),
      usage: `${((1 - os.freemem() / os.totalmem()) * 100).toFixed(2)}%`,
    },
    cpu: {
      model: os.cpus()[0].model,
      cores: os.cpus().length,
      speed: `${os.cpus()[0].speed} Mhz`,
    },
  };
  return info;
}
function formatUptime(seconds) {
  const days = Math.floor(seconds / (60 * 60 * 24));
  const hours = Math.floor((seconds % (60 * 60 * 24)) / (60 * 60));
  const minutes = Math.floor((seconds % (60 * 60)) / 60);
  const secs = Math.floor(seconds % 60);
  return `${days}d ${hours}h ${minutes}m ${secs}s`;
}
function formatByte(bytes) {
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  if (bytes === 0) return "o Bytes";
  const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
  return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
}
const systemInfo = getSystemInfo();
const jsonSystemInfo = JSON.stringify(systemInfo, null, 2);

export const getDashboard = (req, res) => {
  res.render("dashboard.ejs", { jsonSystemInfo });
};
export const postRegisterAdmin = async (req, res) => {
  try {
    let { emailAdmin, pwAdmin, valueDecentAdmin } = req.body;
    const salt = await bcrypt.genSalt(10);
    pwAdmin = await bcrypt.hash(pwAdmin, salt);
    let registerAdmin = new adminEntity({
      email: emailAdmin,
      password: pwAdmin,
      role: valueDecentAdmin,
    });
    registerAdmin.save();
    res.json({ mess: "Đăng ký tài khoản admin thành công", success: true });
  } catch (error) {
    res.json({
      mess: "Đăng ký tài khoản admin thất bại",
      success: false,
      err: error.message,
    });
  }
};
