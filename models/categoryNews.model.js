import mongoose from "mongoose";
const categoryNewsSchema=mongoose.Schema({
    name:{
        type:String,
        required:true,
    }
})
export const categoryNewsEntity=mongoose.model("categoryNewsEntity",categoryNewsSchema,"category_news");