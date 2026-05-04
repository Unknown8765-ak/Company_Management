import express from "express";
import {
  generateSalary,
  getMySalary,
  getAllSalaries,
  markSalaryPaid,
} from "../controllers/salary.controller.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();
router.post("/generate", verifyJWT,generateSalary);
router.get("/me", verifyJWT, getMySalary);
router.get("/", verifyJWT,getAllSalaries);
router.patch("/:id/pay",verifyJWT, markSalaryPaid);


export default router; 