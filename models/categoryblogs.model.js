import mongoose from "mongoose";
const categoryblogsSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  createAt: {
    type: Date,
    default: Date.now(),
  },
});
export const categoryblogsEntity = mongoose.model(
  "categoryblogsEntity",
  categoryblogsSchema,
  "category_blogs",
);
