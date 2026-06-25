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
    type: String,
    required: true,
  },
});
otpSchema.index({ createAt: 1 }, { expireAfterSeconds: 180 });
export const otpEntity = mongoose.model("otpEntity", otpSchema, "otp");
