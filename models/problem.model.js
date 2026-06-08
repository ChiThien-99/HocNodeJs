import mongoose from "mongoose";
const problemSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  createAt: {
    type: Date,
    default: Date.now(),
  },
});
export const problemEntity = mongoose.model(
  "problemEntity",
  problemSchema,
  "problem",
);
