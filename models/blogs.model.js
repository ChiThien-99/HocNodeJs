import mongoose from "mongoose";
const blogsSchema = mongoose.Schema({
  image: {
    type: String,
    required: true,
  },
  cloudinary_id: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  info: {
    type: String,
    required: true,
  },
  category: {
    type: Array,
    required: true,
  },
  views: {
    type: Number,
    default: 0,
    min: 0,
  },
  createAt: {
    type: Date,
    default: Date.now(),
  },
});
export const blogsEntity = mongoose.model("blogsEntity", blogsSchema, "blogs");
