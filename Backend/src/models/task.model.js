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
  company: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Company"
},
  deadline: {
    type: Date
  },

  status: {
    type: String,
    enum: ["pending", "in_progress", "completed"],
    default: "pending"
  },
  progress: {
  type: Number,
  default: 0,
  min: 0,
  max: 100
},
  attachments: [
      {
        fileUrl: {
          type: String,
          required: true
        },
        fileName: {
          type: String
        },
        uploadedAt: {
          type: Date,
          default: Date.now
        }
      }
    ],

    comments: [
      {
        message: {
          type: String,
          required: true
        },
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User"
        },
        createdAt: {
          type: Date,
          default: Date.now
        }
      }
    ],

  updates: [
    {
      message: String,
      progress: Number,
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