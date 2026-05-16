import { Leave } from "../models/leave.model.js";
import { Notification } from "../models/notification.model.js";
import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";


const createLeave = asyncHandler(async (req, res) => {

  const { type, reason, fromDate, toDate } = req.body;

  if (!fromDate || !toDate) {
    throw new ApiError(400, "Dates are required");
  }

  const leave = await Leave.create({
    employee: req.user._id,
    company: req.user.company,
    type,
    reason,
    fromDate,
    toDate
  });

  const adminsAndHR = await User.find({
    company: req.user.company,
    role: { $in: ["admin", "hr"] }
  });

  if (adminsAndHR.length > 0) {
    await Notification.insertMany(
      adminsAndHR.map(user => ({
        userId: user._id,
        type: "leave_applied",
        title: "New Leave Request",
        message: `${req.user.name} applied for leave`,
        relatedId: leave._id,
        createdBy: req.user._id,
        company: req.user.company
      }))
    );
  }

  res.json(new ApiResponse(200, leave, "Leave applied successfully"));
});


const getMyLeaves = asyncHandler(async (req, res) => {

  const leaves = await Leave.find({
    employee: req.user._id,
    company: req.user.company
  }).sort({ createdAt: -1 });

  res.json(new ApiResponse(200, leaves));
});


const getAllLeaves = asyncHandler(async (req, res) => {

  if (!["admin", "hr", "super_admin"].includes(req.user.role)) {
    throw new ApiError(403, "Unauthorized");
  }

  const leaves = await Leave.find({
    company: req.user.company
  })
    .populate("employee", "name email")
    .sort({ createdAt: -1 });

  res.json(new ApiResponse(200, leaves));
});


const updateLeaveStatus = asyncHandler(async (req, res) => {

  if (!["admin", "hr"].includes(req.user.role)) {
    throw new ApiError(403, "Only admin/HR can update leave");
  }

  const { id } = req.params;
  const { status } = req.body;

  if (!["approved", "rejected"].includes(status)) {
    throw new ApiError(400, "Invalid status");
  }

  const leave = await Leave.findOne({
    _id: id,
    company: req.user.company
  });

  if (!leave) {
    throw new ApiError(404, "Leave not found");
  }

  leave.status = status;
  await leave.save();

  await Notification.create({
    userId: leave.employee,
    type: status === "approved" ? "leave_approved" : "leave_rejected",
    title: `Leave ${status}`,
    message: `Your leave has been ${status}`,
    relatedId: leave._id,
    createdBy: req.user._id,
    company: req.user.company
  });

  res.json(new ApiResponse(200, leave, "Leave updated successfully"));
});


const deleteLeave = asyncHandler(async (req, res) => {

  const { id } = req.params;

  const leave = await Leave.findOne({
    _id: id,
    company: req.user.company
  });

  if (!leave) {
    throw new ApiError(404, "Leave not found");
  }

  if (
    leave.employee.toString() !== req.user._id.toString() &&
    !["admin", "hr"].includes(req.user.role)
  ) {
    throw new ApiError(403, "Unauthorized");
  }

  await leave.deleteOne();

  res.json(new ApiResponse(200, {}, "Leave deleted successfully"));
});


export {
  createLeave,
  getMyLeaves,
  getAllLeaves,
  updateLeaveStatus,
  deleteLeave
};