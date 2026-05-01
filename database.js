import mongoose from "mongoose";
export const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/Users");
    console.log("MongoDB connected");
  } catch (error) {
    console.log(`Error conecting DB: ${error}`);
    process.exit(1);
  }
};
