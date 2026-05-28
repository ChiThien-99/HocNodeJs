import { deviceEntity } from "../models/device.model.js";
import { appEntity } from "../models/app.model.js";
import { blogsEntity } from "../models/blogs.model.js";

export const getDetailDevice=async(req,res)=>{
    const {id}=req.params;
    const device=await deviceEntity.findById(id);
    const apps=await appEntity.find().sort("-createAt").limit(4);
    const blogs=await blogsEntity.find().sort("-createAt").limit(4);
    res.render("detailDevice.ejs",{device,apps,blogs});
}