import mongoose from "mongoose";
const orderCounterSchema=new mongoose.Schema({
    dateStr:{
        type:String,
        required:true,
        unique:true,
    },
    count:{
        type:Number,
        default:0,
    }
});
export const orderCounterEntity=mongoose.model("orderCounterEntity",orderCounterSchema,"orderCounter");