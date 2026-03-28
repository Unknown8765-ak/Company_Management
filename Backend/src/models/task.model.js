import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({

  title: {
    type: String,
    required: true
  },

  description: {
    type: String
  },

  assignedTo: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User"
},

  assignedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  deadline: {
    type: Date
  },

  status: {
    type: String,
    enum: ["pending", "in_progress", "completed"],
    default: "pending"
  },

  updates: [
    {
      message: String,
      updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      },
      date: Date
    }
  ]

},
{ timestamps: true });

export default mongoose.model("Task", taskSchema);