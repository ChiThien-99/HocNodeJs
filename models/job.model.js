import mongoose from "mongoose";
const jobSchema=mongoose.Schema({
    level:{
        type:String,
        required:true,
    },
    title:{
        type:String,
        required:true,
    },
    deadline:{
        type:Date,
        required:true,
    },
    assigned:{
        type:String,
        required:true,
    },
    mapId:{
        type:String,
        unique:true,
        required:true,
    },
    mindmapStructure:{
        type:mongoose.Schema.Types.Mixed,
        required:true,
    },
},{timestamps:true})
export const jobEntity= mongoose.model("jobEntity",jobSchema,"job");