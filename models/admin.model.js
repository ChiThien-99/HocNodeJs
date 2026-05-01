import mongoose from "mongoose";
const adminSchema = mongoose.Schema({
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
  role: {
    type: Array,
    require: true,
  },
});
export const adminEntity = mongoose.model("adminEntity", adminSchema, "admin");
