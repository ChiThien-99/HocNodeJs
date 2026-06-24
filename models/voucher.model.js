import mongoose from "mongoose";
const voucherSchema=mongoose.Schema({
    applyToCategory:{
        type:String,
        enum:["app","device","all"],
        required:true,
    },
    code:{
        type:String,
        required:true,
        unique:true,
        uppercase:true,
        trim:true,
    },
    clientIds:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"client",
        required:true,
    }],
    image:{
        type:String,
        required:true,
    },
    cloudinary_id: {
    type: String,
    required: true,
  },
    title:{
        type:String,
        required:true,
    },
    content:{
        type:String,
        required:true,
    },
    discountPercentage:{
        type:Number,
        required:true,
        min:1,
        max:100,
    },
    usersUsed:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"client",
    }],
    isActive:{
        type:Boolean,
        default:true,
    },
    createdAt:{
        type:Date,
        default:Date.now,
    },
})
export const voucherEntity=mongoose.model("voucherEntity",voucherSchema,"voucher");