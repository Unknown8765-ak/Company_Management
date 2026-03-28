import express from "express"
import { verifyJWT } from "../middlewares/auth.middleware.js"

import {
    createRequirement,
    getAllRequirements,
    getMyRequirements,
    updateRequirementStatus,
    deleteRequirement,
    sendToAdmin
} from "../controllers/requirement.controller.js"

const router = express.Router()

// Create Requirement
router.post("/create", verifyJWT, createRequirement)

// Get all requirements (HR / Admin)
router.get("/", verifyJWT, getAllRequirements)

// Get logged in user's requirements
router.get("/my-requirements", verifyJWT, getMyRequirements)

// Approve / Reject requirement
router.patch("/status", verifyJWT, updateRequirementStatus)
router.delete("/:id", verifyJWT, deleteRequirement)
router.patch("/send-to-admin", verifyJWT, sendToAdmin)

export default router