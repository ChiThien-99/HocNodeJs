import mongoose from "mongoose";
const commentSchema=mongoose.Schema({
    newsId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"newsEntity",
        required:true,
    },
    author:{
        type:String,
        default:"Ẩn danh",
    },
    content:{
        type:String,
        required:true,
    },
    likes:{
        type:[String],
        default:[],
    },
    parentId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"commentEntity",
        default:null,
    },
    createAt: {
    type: Date,
    default: Date.now(),
    },
})
export const commentEntity=mongoose.model("commentEntity",commentSchema,"comment");