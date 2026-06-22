import mongoose from "mongoose";
const clientScheme = mongoose.Schema({
  fullname: {
    type: String,
    required: true,
  },
  datebirth: {
    type: Date,
    required: true,
  },
  gender:{
    type:String,
    required:true,
  },
  tel: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  refreshToken: {
    type: [String],
  },
  otpCode: {
    type: String,
  },
  otpExpired: {
    type: Date,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  softwareTrials:[
    {
      softwareId:{
        type:String,
        required:true,
      },
      startDate:{
        type:Date,
        default:Date.now,
      },
    }
  ]
});
export const clientEntity = mongoose.model(
  "clientEntity",
  clientScheme,
  "client",
);
