import { carouselEntity } from "../models/carousel.model.js";
import { notifyEntity } from "../models/notification.model.js";
import { appEntity } from "../models/app.model.js";
import { funcAppEntity } from "../models/funcApp.model.js";
import { funcDeviceEntity } from "../models/funcDevice.model.js";
import { deviceEntity } from "../models/device.model.js";
import { categoryblogsEntity } from "../models/categoryblogs.model.js";
import { blogsEntity } from "../models/blogs.model.js";
import { problemEntity } from "../models/problem.model.js";
import { subscribersEntity } from "../models/subscribers.model.js";
import { clientEntity } from "../models/client.model.js";
export const getIndex = async (req, res) => {
  const carousels = await carouselEntity.find().sort("order");
  const notifys = await notifyEntity.find().sort("-createAt");
  const apps = await appEntity.find().sort("-createAt").limit(4);
  const funcApps = await funcAppEntity.find();
  const devices = await deviceEntity.find().sort("-createAt").limit(4);
  const funcDevices = await funcDeviceEntity.find();
  const listCategoryblogs = await categoryblogsEntity.find();
  const listblogs = await blogsEntity.find().sort("-createAt").limit(6);
  res.render("index.ejs", {
    carousels,
    notifys,
    apps,
    funcApps,
    devices,
    funcDevices,
    listblogs,
    listCategoryblogs,
  });
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
export const postProblem = async (req, res) => {
  try {
    let { name, content } = req.body;
    if (!name || name.trim() === "") {
      name = "Ẩn danh";
    }
    if (!content || content.trim() === "") {
      return res.json({
        mess: `Vui lòng điền vấn đề của bạn vào khung nhập`,
        success: true,
      });
    }
    const newProblem = await problemEntity.create({
      name: name,
      content: content,
    });
    const io = req.app.get("socketio");
    io.emit("update-problem", newProblem);
    res.json({
      mess: `Gửi thành công\nCảm ơn bạn rất nhiều \u{1F60A}`,
      success: true,
    });
  } catch (error) {
    res.json({ mess: "Gửi thất bại", success: false, error: error.message });
  }
};
export const postSubscribers = async (req, res) => {
  try {
    let { nameSubscribers, emailSubscribers, telSubscribers } = req.body;
    if (!nameSubscribers || nameSubscribers.trim() === "") {
      return res.json({ mess: "Vui lòng điền tên của bạn", success: false });
    }
    if (
      (!emailSubscribers || emailSubscribers.trim() === "") &&
      (!telSubscribers || telSubscribers.trim() === "")
    ) {
      return res.json({
        mess: "Vui lòng điền email hoặc số điện thoại của bạn",
        success: false,
      });
    }
    if (!emailSubscribers || emailSubscribers.trim() === "") {
      emailSubscribers = "Ẩn";
    }
    if (!telSubscribers || telSubscribers.trim() === "") {
      telSubscribers = "Ẩn";
    }
    await subscribersEntity.create({
      name: nameSubscribers,
      email: emailSubscribers,
      tel: telSubscribers,
    });
    res.json({
      mess: `Đăng ký nhận khuyến mãi thành công\u{1F389}`,
      success: true,
    });
  } catch (error) {
    res.json({
      mess: "Đăng ký nhận khuyến mãi thất bại",
      success: false,
      error: error.message,
    });
  }
};
export const loginClient = (req, res) => {
  const { headerActive } = req.query;
  console.log(headerActive);
  res.render("loginClient.ejs", { headerActive });
};
export const handleSoftwareAccess=async(req,res)=>{
  try {
    const {idClient,idApp,isClientClick}=req.body;
  if (!idClient&&!idApp) {
    return res.json({mess:"Không nhận được idClient và idApp",success:false});
  }
  const client=await clientEntity.findById(idClient);
  if (!client) {
    return res.json({mess:"Không tìm được client từ id",success:false});
  }
  const trialInfo=client.softwareTrials.find(item=>item.softwareId===idApp);
  const trialDuration=30;
  let daysLeft=trialDuration;
  if (!trialInfo) {
    if (isClientClick) {
    const newTrial={
      softwareId:idApp,
      startDate:new Date(),
    }
    client.softwareTrials.push(newTrial);
    await client.save();
    }
  daysLeft=trialDuration;
  } else {
    const nowDate=new Date();
    const startDate=new Date(trialInfo.startDate);
    const timeDiff=nowDate.getTime()-startDate.getTime();
    const daysUsed=Math.floor(timeDiff/(1000*60*60*24));
    daysLeft=trialDuration-daysUsed;
    if (daysLeft<0) {
      daysLeft=0;
    }
  }
  res.json({success:true,daysLeft:daysLeft,isExpired:daysLeft<=0})
  } catch (error) {
  res.json({success:false,mess:"Lỗi không xử lý kết nối phần mềm",error:error.message});
  }
  
}
