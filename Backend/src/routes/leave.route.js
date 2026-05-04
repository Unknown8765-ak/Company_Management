import express from "express";
import {
  createLeave,
  getMyLeaves,
  getAllLeaves,
  updateLeaveStatus,
} from "../controllers/leave.controller.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";
const router = express.Router();

router.post("/", verifyJWT,createLeave);
router.get("/me", verifyJWT, getMyLeaves);
router.get("/", verifyJWT, getAllLeaves);
router.patch("/:id/status", verifyJWT,updateLeaveStatus);


export default router;