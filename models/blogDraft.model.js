import mongoose from "mongoose";
const blogsDraftSchema = mongoose.Schema({
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
});
export const blogsDraftEntity = mongoose.model(
  "blogsDraftEntity",
  blogsDraftSchema,
  "blogsDraft",
);
