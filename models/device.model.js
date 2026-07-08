import mongoose from "mongoose";
const deviceSchema = mongoose.Schema({
  images: [
    {
      url: String,
      cloudinary_id: String,
    },
  ],
  color: [
    {
      name: String,
      index: Number,
      url: String,
      cloudinary_id: String,
    },
  ],
  name: {
    type: String,
    required: true,
  },
  info: {
    type: String,
    required: true,
  },
  cost:{
    type:Number,
    required:true,
  },
  priceLE: {
    type: Number,
    required: true,
  },
  priceSI: {
    type: Number,
    required: true,
  },
  inventory:{
    type:Number,
    required:true,
  },
  func: {
    type: Array,
    required: true,
  },
  instruction: {
    type: String,
    required: true,
  },
  createAt: {
    type: Date,
    default: Date.now(),
  },
});
export const deviceEntity = mongoose.model(
  "deviceEntity",
  deviceSchema,
  "device",
);
