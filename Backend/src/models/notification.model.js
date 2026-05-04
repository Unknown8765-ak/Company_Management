import mongoose from "mongoose"

const notificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  type: {
    type: String,
    enum: [
      "task_assigned",
      "requirement_raised",
      "task_update_added",
      "requirement_approved",
      "requirement_rejected",
      "requirement_forwarded",
      "task_comment",
       // 🔥 ADD THESE
  "leave_applied",
  "leave_approved",
  "leave_rejected",
  "salary_generated",
"salary_paid"
    ],
    required: true
  },

  title: String,
  message: String,

  // 🔥 kis entity se related hai
  relatedId: {
    type: mongoose.Schema.Types.ObjectId
  },

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  company: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Company",
  required: true
},

  isRead: {
    type: Boolean,
    default: false
  }

}, { timestamps: true });

export const Notification = mongoose.model("Notification",notificationSchema)
