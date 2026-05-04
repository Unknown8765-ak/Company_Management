// models/leave.model.js
import mongoose from "mongoose";

const leaveSchema = new mongoose.Schema({
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  company: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Company",
  required: true
},
  type: {
    type: String,
    enum: ["sick", "casual", "paid"],
    default: "casual"
  },
  reason: String,
  fromDate: Date,
  toDate: Date,
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending"
  }
}, { timestamps: true });

export const Leave = mongoose.model("Leave", leaveSchema);