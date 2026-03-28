import express from "express"

import {
createDepartment,
getDepartments,
updateDepartment,
deleteDepartment,
addMemberToDepartment,
getDepartmentAnalytics
// transferEmployee,
} from "../controllers/department.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"

const router = express.Router()

router.post("/create-department", verifyJWT, createDepartment)
router.get("/departments", getDepartments)
router.put("/department/:id", verifyJWT,updateDepartment)
router.delete("/delete-department/:id",verifyJWT, deleteDepartment)
router.post("/department/add-member", addMemberToDepartment)
// router.put("/department/transfer", transferEmployee)
router.get("/department/analytics", getDepartmentAnalytics)

export default router