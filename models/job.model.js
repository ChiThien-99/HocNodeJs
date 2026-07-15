import mongoose from "mongoose";
const jobSchema = mongoose.Schema(
  {
    status: {
      type: String,
      enum: ["progress", "completed"],
      required: true,
    },
    level: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    startTime:{
      type:Date,
      required:true,
    },
    deadline: {
      type: Date,
      required: true,
    },
    assigned: [
      {
        id: {
          type: mongoose.Schema.Types.ObjectId,
          ref:"admin",
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
      },
    ],
    mapId: {
      type: String,
      unique: true,
      required: true,
    },
    mindmapStructure: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
  },
  { timestamps: true },
);
export const jobEntity = mongoose.model("jobEntity", jobSchema, "job");
