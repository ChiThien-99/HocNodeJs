import mongoose from "mongoose";
const subscribersSchema=mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
    },
    tel:{
        type:String,
        required:true,
    }
})
export const subscribersEntity=mongoose.model("subscribersEntity",subscribersSchema,"subscribers");