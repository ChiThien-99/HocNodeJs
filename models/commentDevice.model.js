import mongoose from "mongoose";
const commentSchema = mongoose.Schema({
  deviceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "deviceEntity",
    required: true,
  },
  author: {
    type: String,
    default: "Ẩn danh",
  },
  content: {
    type: String,
    required: true,
  },
  likes: {
    type: [String],
    default: [],
  },
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "commentDeviceEntity",
    default: null,
  },
  createAt: {
    type: Date,
    default: Date.now(),
  },
});
export const commentDeviceEntity = mongoose.model(
  "commentDeviceEntity",
  commentSchema,
  "commentDevice",
);
