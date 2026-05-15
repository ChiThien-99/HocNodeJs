import { bannerEntity } from "../models/banner.model.js";
import { notifyEntity } from "../models/notification.model.js";
import { appEntity } from "../models/app.model.js";
import { funcAppEntity } from "../models/funcApp.model.js";
import { funcDeviceEntity } from "../models/funcDevice.model.js";
import { deviceEntity } from "../models/device.model.js";
export const getIndex = async (req, res) => {
  const banners = await bannerEntity.find().sort("order");
  const notifys = await notifyEntity.find().sort("-createAt");
  const apps = await appEntity.find().sort("-createAt").limit(6);
  const funcApps = await funcAppEntity.find();
  const devices = await deviceEntity.find().sort("-createAt").limit(6);
  const funcDevices = await funcDeviceEntity.find();
  res.render("index.ejs", {
    banners,
    notifys,
    apps,
    funcApps,
    devices,
    funcDevices,
  });
};
export const filterNewApp = async (req, res) => {
  try {
    const io = req.app.get("socketio");
    const allApp = await appEntity.find().sort("-createAt").limit(6);
    io.emit("update-app", allApp);
    res.json({ mess: "Lọc app mới nhất thành công", success: true });
  } catch (error) {
    res.json({
      mess: "Lọc app mới nhất thất bại",
      success: false,
      error: error.message,
    });
  }
};
export const filterPopularApp = async (req, res) => {
  try {
    const io = req.app.get("socketio");
    const allApp = await appEntity.find().sort("-views").limit(6);
    io.emit("update-app", allApp);
    res.json({ mess: "Lọc app phổ biến thành công", success: true });
  } catch (error) {
    res.json({
      mess: "Lọc app phổ biến thất bại",
      success: false,
      error: error.message,
    });
  }
};
export const filterFuncApp = async (req, res) => {
  try {
    const { names } = req.query;
    const query = {};
    if (names) {
      const filterArray=Array.isArray(names)?names:[names];
      query.func={$all:filterArray}
    }
    const io = req.app.get("socketio");
    const allApp = await appEntity.find(query).sort("-createAt").limit(6);
    io.emit("update-app", allApp);
    res.json({ mess: "Lọc chức năng app thành công", success: true });
  } catch (error) {
    res.json({
      mess: "Lọc chức năng app thất bại",
      success: false,
      error: error.message,
    });
  }
};
export const filterTypeNotify = async (req, res) => {
  try {
    const { type } = req.query;
    const query = {};
    if (type && type !== "all") {
      query.type = type;
    }
    const io = req.app.get("socketio");
    const allNotify = await notifyEntity.find(query).sort("-createAt");
    io.emit("update-notify", allNotify);
    res.json({ mess: "Lọc type notify thành công", success: true });
  } catch (error) {
    res.json({
      mess: "Lọc type notify thất bại",
      success: false,
      error: error.message,
    });
  }
};
export const filterNewDevice=async(req,res)=>{
  try {
    const io = req.app.get("socketio");
    const allDevice = await deviceEntity.find().sort("-createAt");
    io.emit("update-device", allDevice);
    res.json({mess:"Lọc thiết bị mới thành công",success:true});
  } catch (error) {
    res.json({mess:"Lọc thiết bị mới thất bại",success:false,error:error.message});
  }
};
export const filterPriceLowHigh=async(req,res)=>{
  try {
    const io = req.app.get("socketio");
    const allDevice = await deviceEntity.find().sort("price");
    io.emit("update-device", allDevice);
    res.json({mess:"Lọc giá thiết bị từ thấp đến cao thành công",success:true});
  } catch (error) {
    res.json({mess:"Lọc giá thiết bị từ thấp đến cao thất bại",success:false,error:error.message});
  }
};
export const filterPriceHighLow=async(req,res)=>{
  try {
    const io = req.app.get("socketio");
    const allDevice = await deviceEntity.find().sort("-price");
    io.emit("update-device", allDevice);
    res.json({mess:"Lọc giá thiết bị từ cao đến thấp thành công",success:true});
  } catch (error) {
    res.json({mess:"Lọc giá thiết bị từ cao đến thấp thất bại",success:false,error:error.message});
  }
};
export const filterFuncDevice=async(req,res)=>{
  try {
    const { names } = req.query;
    const query = {};
    if (names) {
      const filterArray=Array.isArray(names)?names:[names];
      query.func={$all:filterArray}
    }
    const io = req.app.get("socketio");
    const allDevice = await deviceEntity.find(query).sort("-createAt").limit(6);
    io.emit("update-device", allDevice);
    res.json({ mess: "Lọc chức năng thiết bị thành công", success: true });
  } catch (error) {
    res.json({
      mess: "Lọc chức năng thiết bị thất bại",
      success: false,
      error: error.message,
    });
  }
}
