import mongoose from "mongoose";
const funcAppSchema=mongoose.Schema({
name:{
        type:String,
        required:true,
    },
createAt: {
    type: Date,
    default: Date.now(),
  },
} 
)
export const funcAppEntity=mongoose.model("funcAppEntity",funcAppSchema,"function_app");