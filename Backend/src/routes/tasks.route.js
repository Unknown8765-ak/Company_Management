import express from "express"

import {
createTask,
assignTask,
getAllTasks,
getEmployeeTasks,
updateTaskStatus,
addTaskUpdate,
deleteTask
} from "../controllers/tasks.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"

const router = express.Router()

router.post("/create-task/:id", verifyJWT, createTask)
router.put("/task/assign",verifyJWT, assignTask)
router.get("/tasks", verifyJWT, getAllTasks)
router.get("/my-tasks",verifyJWT, getEmployeeTasks)
router.put("/task/status", verifyJWT,updateTaskStatus)
router.post("/task/update", addTaskUpdate)
router.delete("/task/delete/:id",verifyJWT, deleteTask)

export default router