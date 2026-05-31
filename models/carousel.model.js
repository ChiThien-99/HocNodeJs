import mongoose from "mongoose";
const carouselSchema = mongoose.Schema({
  image: {
    type: String,
    required: true,
  },
  cloudinary_id: {
    type: String,
    required: true,
  },
  caption: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    default: "#",
  },
  order: {
    type: Number,
    default: 0,
  },
});
export const carouselEntity = mongoose.model(
  "carouselEntity",
  carouselSchema,
  "carousel",
);
