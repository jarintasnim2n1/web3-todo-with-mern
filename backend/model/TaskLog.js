const mongoose = require("mongoose");

// MongoDB model - task log/history rakhbe (MERN part)
const taskLogSchema = new mongoose.Schema(
  {
    taskId: {
      type: Number,
      required: true,
    },
    taskName: {
      type: String,
      required: true,
    },
    taskDate: {
      type: String,
      required: true,
    },
    action: {
      type: String,
      enum: ["created", "updated", "deleted"],
      required: true,
    },
    walletAddress: {
      type: String,
      required: true,
    },
    txHash: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

const TaskLog = mongoose.model("TaskLog", taskLogSchema);
module.exports = TaskLog;
