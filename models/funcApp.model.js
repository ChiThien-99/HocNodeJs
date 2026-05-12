import mongoose from "mongoose";
const funcAppSchema=mongoose.Schema({
name:{
        type:String,
        required:true,
    }
} 
)
export const funcAppEntity=mongoose.model("funcAppEntity",funcAppSchema,"function_app");