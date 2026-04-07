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
router.post("/create", verifyJWT, createRequirement)

router.get("/", verifyJWT, getAllRequirements)
router.get("/my-requirements", verifyJWT, getMyRequirements)
router.patch("/status", verifyJWT, updateRequirementStatus)
router.delete("/:id", verifyJWT, deleteRequirement)
router.patch("/send-to-admin", verifyJWT, sendToAdmin)

export default router