import express from "express"
import {
createHR,
createEmployee,
getAllEmployees,
getSingleEmployee,
updateEmployee,
deleteEmployee,
getAllHR
} from "../controllers/user.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"

const router = express.Router()

router.post("/create-hr",verifyJWT, createHR)
router.post("/create-employee",verifyJWT, createEmployee)

router.get("/employees",verifyJWT, getAllEmployees)
router.get("/hrs", verifyJWT, getAllHR)
router.get("/employees/:id", verifyJWT,getSingleEmployee)

router.put("/update-employees/:id",verifyJWT, updateEmployee)
router.delete("/delete-employee/:id", verifyJWT, deleteEmployee)

export default router