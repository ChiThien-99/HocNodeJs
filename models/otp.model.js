import mongoose from "mongoose";
const otpSchema = mongoose.Schema({
  tel: {
    type: String,
    required: true,
  },
  otpCode: {
    type: String,
    required: true,
  },
  createAt: {
    type:Date,
    default:Date.now,
  },
});
otpSchema.index({ createAt: 1 }, { expireAfterSeconds: 180 });
export const otpEntity = mongoose.model("otpEntity", otpSchema, "otp");
