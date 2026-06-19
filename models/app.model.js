import mongoose from "mongoose";
const appSchema = mongoose.Schema({
  image: {
    type: String,
    required: true,
  },
  cloudinary_id: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  info: {
    type: String,
    required: true,
  },
  priceLE:{
    type:String,
    required:true,
  },
  priceSI:{
    type:String,
    required:true,
  },
  func: {
    type: Array,
    required: true,
  },
  views:{
    type:Number,
    default:0,
    min:0,
  },
  instruction:{
    type:String,
    required:true,
  },
  createAt: {
    type: Date,
    default: Date.now(),
  },
});
appSchema.index({views:-1});
export const appEntity = mongoose.model("appEntity", appSchema, "app");
