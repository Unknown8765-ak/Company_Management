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
      "requirement_approved",
      "requirement_rejected"
    ],
    required: true
  },

  title: String,
  message: String,

  // 🔥 kis entity se related hai
  relatedId: {
    type: mongoose.Schema.Types.ObjectId
  },

  // 🔥 kisne action kiya (HR ya employee)
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  isRead: {
    type: Boolean,
    default: false
  }

}, { timestamps: true });