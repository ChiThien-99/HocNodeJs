import mongoose from "mongoose";
import { type } from "os";
const bannerSchema = mongoose.Schema({
  page: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  cloudinary_id: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
});
export const bannerEntity = mongoose.model(
  "bannerEntity",
  bannerSchema,
  "banner",
);
