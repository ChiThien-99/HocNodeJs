import mongoose from "mongoose";
const cartScheme=mongoose.Schema({
    clientId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"client",
        required:true,
        unique:true,
    },
    products:[
        {
            category:{type:String,enum:["app","device"],required:true},
            productId:{type:String,required:true},
            productName:{type:String,required:true},
            price:{type:Number,required:true},
            quantity:{type:Number,required:true,default:1},
            color:{type:String,required:true},
        }
    ],
    updateAt:{
        type:Date,
        default:Date.now,
    },
})
export const cartEntity=mongoose.model("cartEntity",cartScheme,"cart");