import mongoose from "mongoose";
const funcDeviceSchema=mongoose.Schema({
    name:{
        type:String,
        required:true,
    }
})
export const funcDeviceEntity=mongoose.model("funcDeviceEntity",funcDeviceSchema,"function_device");