import mongoose from "mongoose";
const bannerSchema=mongoose.Schema({
    image:{
        type:String,
        required:true,
    },
    caption:{
        type:String,
        required:true,
    },
    url:{
        type:String,
        default:"#",
    },
    order:{
        type:Number,
        default:0,
    },
})
export const bannerEntity=mongoose.model("bannerEntity",bannerSchema,"banner");