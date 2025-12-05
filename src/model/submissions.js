const mongoose = require("mongoose");
const { Schema } = mongoose;

const submissionsSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    problemId: {
      type: Schema.Types.ObjectId,
      ref: "problem",
      required: true,
    },
    code: {
      type: String,
      required: true,
    },
    language: {
      type: String,
      required: true,
      enum: ["javascript", "java", "c++"],
    },
    status: {
      type: String,
      enum: ["pending", "accpted", "wrong", "error"],
      default: "pending",
    },
    runtime: {
      type: Number,
      default: 0,
    },
    memory: {
      type: Number,
      default: 0,
    },
    errorMessage: {
      type: String,
      default: "",
    },
    testCasePassed: {
      type: Number,
      default: 0,
    },
    testCaseTotal: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

submissionsSchema.index({userId:1 , problemId:1})
const Submissions=mongoose.model('submissions',submissionsSchema)

module.exports=Submissions