import mongoose from "mongoose";
const adminSchema = mongoose.Schema(
  {
    fullname: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    decent: {
      type: Array,
      required: true,
    },
    mfa: {
      isEnabled: { type: Boolean, default: false },
      secret: { type: String, default: null },
      backupCodes: [{ type: String }],
    },
    pushSubscription: {
      endpoint: { type: String },
      expirationTime: { type: Number, default: null },
      keys: {
        p256dh: { type: String },
        auth: { type: String },
      },
    },
    refreshToken: {
      type: [String],
    },
  },
  { timestamps: true },
);
export const adminEntity = mongoose.model("adminEntity", adminSchema, "admin");
