import { bannerEntity } from "../models/banner.model.js";
import { notifyEntity } from "../models/notification.model.js";
import { appEntity } from "../models/app.model.js";
import { funcAppEntity } from "../models/funcApp.model.js";
export const getIndex = async (req, res) => {
  const banners = await bannerEntity.find().sort("order");
  const notifys = await notifyEntity.find().sort("-createAt");
  const apps = await appEntity.find().sort("-createAt").limit(6);
  const funcApps=await funcAppEntity.find();
  res.render("index.ejs", { banners, notifys, apps, funcApps });
};
export const filterNewApp=async (req,res)=>{
  try {
  const io = req.app.get("socketio");
  const allApp = await appEntity.find().sort("-createAt").limit(6);
  io.emit("update-app", allApp);
  res.json({mess:"Lọc app mới nhất thành công",success:true});
  } catch (error) {
  res.json({mess:"Lọc app mới nhất thất bại",success:false,error:error.message});
  }
};
export const filterPopularApp=async(req,res)=>{
  try {
  const io = req.app.get("socketio");
  const allApp = await appEntity.find().sort("-views").limit(6);
  io.emit("update-app", allApp);
  res.json({mess:"Lọc app phổ biến thành công",success:true});
  } catch (error) {
  res.json({mess:"Lọc app phổ biến thất bại",success:false,error:error.message});
  }
};
export const filterFuncApp=async(req,res)=>{
  try {
  const {name}=req.query;
  const query={};
  if(name){
    query.func=name;
  };
  const io = req.app.get("socketio");
  const allApp = await appEntity.find(query).sort("-createAt").limit(6);
  io.emit("update-app", allApp);
  res.json({mess:"Lọc chức năng app thành công",success:true});
  } catch (error) {
  res.json({mess:"Lọc chức năng app thất bại",success:false,error:error.message});
  }
  
}
export const filterTypeNotify=async (req,res)=>{
  try {
  const {type}=req.query;
  const query={};
  if (type&&type!=="all") {
    query.type=type;
  }
  const io = req.app.get("socketio");
  const allNotify = await notifyEntity.find(query).sort("-createAt");
  io.emit("update-notify", allNotify);
  res.json({mess:"Lọc type notify thành công",success:true});
  } catch (error) {
  res.json({mess:"Lọc type notify thất bại",success:false,error:error.message});
  }
 
}
