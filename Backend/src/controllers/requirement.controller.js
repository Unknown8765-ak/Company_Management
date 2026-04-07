import { asyncHandler } from "../utils/asyncHandler.js"
import Requirement from "../models/Requirement.model.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { ApiError } from "../utils/ApiError.js";
import  {Notification}  from "../models/notification.model.js";
import {User} from "../models/user.model.js"
// ---------------- CREATE ----------------

// const createRequirement = asyncHandler(async (req, res) => {

//   const { title, description } = req.body

//   if (!title) {
//     throw new ApiError(400, "Requirement title is required")
//   }

//   const requirement = await Requirement.create({
//     title,
//     description,
//     raisedBy: req.user._id
//   })

//   return res.status(201).json(
//     new ApiResponse(201, requirement, "Requirement raised successfully")
//   )
// })

const createRequirement = asyncHandler(async (req, res) => {

  const { title, description } = req.body;

  if (!title) {
    throw new ApiError(400, "Requirement title is required");
  }

  const requirement = await Requirement.create({
  title,
  description,
  raisedBy: req.user._id,
  department: req.user.department
})

  const hr = await User.findOne({
  role: "hr",
  department: req.user?.department
});
console.log("FOUND HR:", hr)
console.log("USER:", req.user)
console.log("USER DEPARTMENT:", req.user.department)

if (hr) {
  await Notification.create({
    userId: hr._id,
    type: "requirement_raised",
    title: "New Requirement",
    message: `${req.user.name} raised a requirement`,
    relatedId: requirement._id,
    createdBy: req.user._id
  });
}

  return res.status(201).json(
    new ApiResponse(201, requirement, "Requirement raised successfully")
  );
});


// ---------------- GET ALL (HR + ADMIN) ----------------

const getAllRequirements = asyncHandler(async (req, res) => {

  if (!["hr", "super_admin"].includes(req.user.role)) {
    throw new ApiError(403, "Not authorized")
  }

  const requirements = await Requirement.find()
    .populate("raisedBy", "name email")
    .populate("approvedBy", "name")
    .populate("forwardedBy", "name")

  return res.status(200).json(
    new ApiResponse(200, requirements, "Fetched successfully")
  )
})


// ---------------- GET MY ----------------

const getMyRequirements = asyncHandler(async (req, res) => {

  const requirements = await Requirement.find({
    raisedBy: req.user._id
  }).populate("approvedBy", "name")

  return res.status(200).json(
    new ApiResponse(200, requirements, "Your requirements")
  )
})

const sendToAdmin = asyncHandler(async (req, res) => {

  if (req.user.role !== "hr") {
    throw new ApiError(403, "Only HR can forward")
  }

  const { id } = req.body

  const requirement = await Requirement.findById(id)


  if (!requirement) {
    throw new ApiError(404, "Requirement not found")
  }
  console.log(requirement)
  requirement.status = "forwarded"
  requirement.sentToAdmin =  true
  requirement.forwardedBy = req.user._id

  await Notification.create({
  userId: requirement.raisedBy,
  type: "requirement_forwarded",
  title: "Requirement Sent to Admin",
  message: "Your requirement is sent to admin for approval",
  relatedId: requirement._id,
  createdBy: req.user._id
});

  const admin = await User.findOne({ role: "super_admin" });
  
  if (!admin) {
  throw new ApiError(404, "Admin not found");
}
console.log("Requirement:", requirement)
console.log("Sending to admin ID:", admin?._id)
if (admin) {
  await Notification.create({
    userId: admin._id,
    type: "requirement_forwarded",
    title: "New Requirement for Approval",
    message: "A requirement has been sent for approval",
    relatedId: requirement._id,
    createdBy: req.user._id
  });
}

  await requirement.save()
  

  return res.status(200).json(
    new ApiResponse(200, requirement, "Sent to Super Admin")
  )
})


// ---------------- APPROVE / REJECT (ONLY SUPER ADMIN) ----------------

const updateRequirementStatus = asyncHandler(async (req, res) => {

  if (req.user.role !== "super_admin") {
    throw new ApiError(403, "Only super admin can approve/reject")
  }

  const { requirementId, status } = req.body

  if (!["approved", "rejected"].includes(status)) {
    throw new ApiError(400, "Invalid status")
  }

  const requirement = await Requirement.findById(requirementId)

  if (!requirement) {
    throw new ApiError(404, "Requirement not found")
  }

  requirement.status = status
  requirement.approvedBy = req.user._id

  const type = status === "approved"
  ? "requirement_approved"
  : "requirement_rejected";
  
  await Notification.create({
  userId: requirement.raisedBy,
  type,
  title: status === "approved"
    ? "Requirement Approved"
    : "Requirement Rejected",
  message: `Your requirement has been ${status}`,
  relatedId: requirement._id,
  createdBy: req.user._id
});

  const hr = await User.findOne({
  role: "hr",
  department: requirement.department
}); 
console.log("USER:", req.user)
console.log("USER DEPARTMENT:", req.user.department)

if (hr) {
  await Notification.create({
    userId: hr._id,
    type,
    title: "Requirement Status Updated",
    message: `A requirement was ${status}`,
    relatedId: requirement._id,
    createdBy: req.user._id
  });
}

  await requirement.save()

  return res.status(200).json(
    new ApiResponse(200, requirement, "Status updated")
  )
})


// ---------------- DELETE ----------------

const deleteRequirement = asyncHandler(async (req, res) => {

  const { id } = req.params

  const requirement = await Requirement.findById(id)

  if (!requirement) {
    throw new ApiError(404, "Requirement not found")
  }

  if (
    requirement.raisedBy.toString() !== req.user._id.toString() &&
    req.user.role !== "super_admin"
  ) { 
    throw new ApiError(403, "Not allowed")
  }

  await requirement.deleteOne()

  return res.status(200).json(
    new ApiResponse(200, null, "Deleted successfully")
  )
})

export {
  createRequirement,
  getAllRequirements,
  getMyRequirements,
  deleteRequirement,
  updateRequirementStatus,
  sendToAdmin
}