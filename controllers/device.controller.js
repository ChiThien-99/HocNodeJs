import { funcDeviceEntity } from "../models/funcDevice.model.js"
import { deviceEntity } from "../models/device.model.js";
import { appEntity } from "../models/app.model.js";
import { blogsEntity } from "../models/blogs.model.js";
export const getDevice=async(req,res)=>{
    const funcDevice=await funcDeviceEntity.find().sort("-createAt");
    const apps = await appEntity.find().sort("-createAt").limit(4);
    const blogs=await blogsEntity.find().sort("-createAt").limit(4);
    const limit = 12;
    const currentPage = parseInt(req.query.page) || 1;
    const currentFunc = req.query.func || "";
    const sort = req.query.sort || "-createAt";
    const query = {};
    let filterArray = [];
    if (currentFunc) {
        filterArray = Array.isArray(currentFunc)
          ? currentFunc
          : currentFunc.split(",");
        query.func = { $all: filterArray };
    }
    const skip = (currentPage - 1) * limit;
    const [deviceList, deviceTotal] = await Promise.all([
        deviceEntity.find(query).sort(`${sort}`).skip(skip).limit(limit),
        deviceEntity.countDocuments(query),
    ]);
    const totalPage = Math.ceil(deviceTotal / limit);
    res.render("device.ejs",{funcDevice,apps,blogs,currentPage,currentFunc,sort,deviceList,totalPage})
}