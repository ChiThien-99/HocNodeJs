import mongoose from "mongoose";
const funcDeviceSchema=mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    createAt: {
       type: Date,
       default: Date.now(),
  },
})
export const funcDeviceEntity=mongoose.model("funcDeviceEntity",funcDeviceSchema,"function_device");