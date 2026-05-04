import express from "express";
import {
  createCompany,
  getAllCompanies,
  getCompanyById,
  updateCompany,
  deleteCompany,
} from "../controllers/company.controller.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/",verifyJWT, createCompany);             
router.get("/",verifyJWT, getAllCompanies);             
router.get("/:id",verifyJWT, getCompanyById);            
router.put("/:id",verifyJWT, updateCompany);         
router.delete("/:id",verifyJWT, deleteCompany);      

export default router;