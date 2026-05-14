import mongoose from "mongoose";
const deviceSchema = mongoose.Schema({
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
