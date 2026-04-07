import express from "express"

import {
createTask,
assignTask,
getAllTasks,
getEmployeeTasks,
addTaskUpdate,
deleteTask,
addComment
} from "../controllers/tasks.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"

const router = express.Router()

router.post("/create-task/:id",upload.single("file"), verifyJWT, createTask)
router.put("/task/assign",verifyJWT, assignTask)
router.get("/tasks", verifyJWT, getAllTasks)
router.get("/my-tasks",verifyJWT, getEmployeeTasks)
router.post("/task/:id/comment",verifyJWT, addComment);
router.post("/task/update/:id", verifyJWT, addTaskUpdate)
router.delete("/task/delete/:id",verifyJWT, deleteTask)

export default router