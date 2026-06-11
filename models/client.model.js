import mongoose from "mongoose";
const clientScheme=mongoose.Schema({
    fullname:{
        type:String,
        required:true,
    },
    datebirth:{
        type:Date,
        required:true,
    },
    tel:{
        type:Number,
        required:true,
    },
    email:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true,
    },
    refreshToken: {
    type: [String],
  },
})
export const clientEntity=mongoose.model("clientEntity",clientScheme,"client");