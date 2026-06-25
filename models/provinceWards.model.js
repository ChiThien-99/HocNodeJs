import mongoose from "mongoose";
const provinceWardsSchema=mongoose.Schema({
    province:{
        type:String,
        required:true,
    },
    wards:[
        {
            name:{
                type:String,
                required:true,
            }
        }
    ]
});
export const provinceWardsEntity=mongoose.model("provinceWardsEntity",provinceWardsSchema,"provincesWards");