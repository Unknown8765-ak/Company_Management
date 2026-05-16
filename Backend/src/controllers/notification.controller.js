import {Notification} from "../models/notification.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

const getMyNotifications = asyncHandler(async (req, res) => {

  const notifications = await Notification.find({
  userId: req.user._id,
  company: req.user.company 
}).sort({ createdAt: -1 });

  return res.status(200).json(
    new ApiResponse(200, notifications, "Notifications fetched")
  );
});

const markNotificationAsRead = asyncHandler(async (req, res) => {

  const { id } = req.params;

  const notification = await Notification.findOne({
  _id: id,
  company: req.user.company 
});

  if (!notification) {
    throw new ApiError(404, "Notification not found");
  }

  // security check
  if (notification.userId.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Not allowed");
  }

  notification.isRead = true;
  await notification.save();

  return res.status(200).json(
    new ApiResponse(200, notification, "Marked as read")
  );
});

export {
    getMyNotifications,
    markNotificationAsRead
}