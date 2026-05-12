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
  url: {
    type: String,
    required: true,
  },
  func: {
    type: Array,
    required: true,
  },
});
export const appEntity = mongoose.model("appEntity", appSchema, "app");
