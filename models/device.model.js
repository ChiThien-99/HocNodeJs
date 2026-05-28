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
      index:Number,
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
  price: {
    type: Number,
    required: true,
  },
  func: {
    type: Array,
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
