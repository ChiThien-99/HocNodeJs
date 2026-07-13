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
  pushSubscription: {
    endpoint: { type: String },
    expirationTime: { type: Number, default: null },
    keys: {
      p256dh: { type: String },
      auth: { type: String }
    }
  },
  refreshToken: {
    type: [String],
  },
},{ timestamps: true });
export const adminEntity = mongoose.model("adminEntity", adminSchema, "admin");
