import mongoose from "mongoose";
const notifySchema = mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ["system", "event", "app", "device", "news"],
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  createAt: {
    type: Date,
    default: Date.now(),
  },
});
export const notifyEntity = mongoose.model(
  "notifyEntity",
  notifySchema,
  "notification",
);
