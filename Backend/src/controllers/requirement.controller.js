import { asyncHandler } from "../utils/asyncHandler.js"
import Requirement from "../models/Requirement.model.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { ApiError } from "../utils/ApiError.js"

// ---------------- CREATE ----------------

const createRequirement = asyncHandler(async (req, res) => {

  const { title, description } = req.body

  if (!title) {
    throw new ApiError(400, "Requirement title is required")
  }

  const requirement = await Requirement.create({
    title,
    description,
    raisedBy: req.user._id
  })

  return res.status(201).json(
    new ApiResponse(201, requirement, "Requirement raised successfully")
  )
})


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

  requirement.status = "forwarded"
  requirement.forwardedBy = req.user._id

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