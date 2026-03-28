import  Task  from "../models/task.model.js"
import { User } from "../models/user.model.js"

import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"



/*
-------------------------
Create Task
HR + Super Admin
-------------------------
*/

const createTask = asyncHandler(async (req,res)=>{

    if(!["hr","super_admin"].includes(req.user.role)){
        throw new ApiError(403,"Not allowed to create task")
    }

    const { title, description, assignedTo, deadline } = req.body

    if(!title){
        throw new ApiError(400,"Task title required")
    }
    if (!assignedTo) {
  throw new ApiError(400, "Please select employee")
}
    const employee = await User.findById(assignedTo)

    if(!employee){
        throw new ApiError(400,"employee not found")
    }
    const hr = await User.findById(req.user._id)
    if (String(hr.department) !== String(employee.department)) {
    throw new ApiError(403, "You can assign task only to your department employees")
}

    const task = await Task.create({
        title,
        description,
        assignedTo,
        assignedBy: req.user._id,
        deadline,
        status: "pending"
    })
    console.log("task :", task)

    const populatedTask = await Task.findById(task._id)
    .populate("assignedTo", "name email")
    .populate("assignedBy", "name")

    console.log("populatedTask" , populatedTask)
    return res
    .status(201)
    .json(
        new ApiResponse(
            201,populatedTask,"Task created successfully"
        ))

})



const assignTask = asyncHandler(async (req,res)=>{
    const { taskId, userIds } = req.body
    const task = await Task.findById(taskId)
    if(!task){
        throw new ApiError(404,"Task not found")
    }
    task.assignedTo = userIds

    await task.save()
    return res
    .status(200)
    .json(new ApiResponse(200,task,"Task assigned successfully"))

})



/*
-------------------------
Get All Tasks
-------------------------
*/

const getAllTasks = asyncHandler(async (req,res)=>{

    let tasks

    if(["hr","super_admin"].includes(req.user.role)){
        // HR / Admin -> all tasks
        tasks = await Task.find()
        .populate("assignedTo","name email")
        .populate("assignedBy","name")
    } 
    else {
        tasks = await Task.find({ assignedTo: req.user._id })
        .populate("assignedTo","name email")
        .populate("assignedBy","name")
    }
    console.log(tasks);
    return res
    .status(200)
    .json(new ApiResponse(200,tasks,"Tasks fetched"))

})  



/*
-------------------------
Get Tasks of Logged Employee
-------------------------
*/

const getEmployeeTasks = asyncHandler(async (req,res)=>{

    const userId = req.user._id

    const tasks = await Task.find({
        assignedTo:userId
    })
    .populate("assignedBy","name")

    return res
    .status(200)
    .json(new ApiResponse(200,tasks,"Employee tasks fetched"))

})



/*
-------------------------
Update Task Status
-------------------------
*/

const updateTaskStatus = asyncHandler(async (req,res)=>{

    const { taskId, status } = req.body

    const task = await Task.findById(taskId)

    if(!task){
        throw new ApiError(404,"Task not found")
    }

    task.status = status

    await task.save()

    return res
    .status(200)
    .json(new ApiResponse(200,task,"Task status updated"))

})



/*
-------------------------
Add Task Update (Daily Work)
-------------------------
*/

const addTaskUpdate = asyncHandler(async (req,res)=>{

    const { taskId, message } = req.body

    const task = await Task.findById(taskId)

    if(!task){
        throw new ApiError(404,"Task not found")
    }

    task.updates.push({
        message,
        updatedBy:req.user._id,
        date:new Date()
    })

    await task.save()

    return res
    .status(200)
    .json(new ApiResponse(200,task,"Task update added"))

})



/*
-------------------------
Delete Task
-------------------------
*/

const deleteTask = asyncHandler(async (req,res)=>{

    const { id } = req.params

    const task = await Task.findByIdAndDelete(id)

    if(!task){
        throw new ApiError(404,"Task not found")
    }

    return res
    .status(200)
    .json(new ApiResponse(200,{}, "Task deleted"))

})



export {
createTask,
assignTask,
getAllTasks,
getEmployeeTasks,
updateTaskStatus,
addTaskUpdate,
deleteTask
}