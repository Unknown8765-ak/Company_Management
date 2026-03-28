import mongoose from "mongoose";

const requirementSchema = new mongoose.Schema({

  title: {
    type: String,
    required: true
  },

  description: {
    type: String
  },

  raisedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  status: {
    type: String,
    enum: ["pending", "forwarded", "approved", "rejected"],
    default: "pending"
  },
  
  sentToAdmin: {
    type: Boolean,
    default: false
  },

  // kis HR ne forward kiya
  forwardedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }

},
{ timestamps: true });

export default mongoose.model("Requirement", requirementSchema);