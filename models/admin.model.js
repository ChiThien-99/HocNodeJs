import mongoose from "mongoose";
const adminSchema = mongoose.Schema({
  fullname: {
    type: String,
    require: true,
  },
  role: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    require: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    require: true,
  },
  decent: {
    type: Array,
    require: true,
  },
  refreshToken: {
    type: [String],
  },
});
export const adminEntity = mongoose.model("adminEntity", adminSchema, "admin");
