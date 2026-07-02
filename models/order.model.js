import mongoose from "mongoose";
const orderSchema=mongoose.Schema({
    orderNumber:{
        type:String,
        required:true,
    },
    idClient:{
        type:String,
        required:true,
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
    voucherDiscount:{
        type:Number,
        required:true,
    },
    paymentMethod:{
        type:String,
        required:true,
    },
    fullnameDelivery: { type: String, required: true },
    telDelivery: { type: String, required: true },
    addressDelivery: { type: String, required: true },
    nameCompany: { type: String, required: true },
    mstCompany: { type: String, required: true },
    addressCompany: { type: String, required: true },
    mailInvoice: { type: String, required: true },
})
export const orderEntity=mongoose.model("orderEntity",orderSchema,"order");