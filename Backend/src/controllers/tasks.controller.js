import  Task  from "../models/task.model.js"
import { User } from "../models/user.model.js"

import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { Notification } from "../models/notification.model.js";
import { uploadoncloudinary } from "../utils/cloudinary.js"


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

    if (req.file) {
    const uploaded = await uploadoncloudinary(req.file.path);

    if (uploaded) {
        task.attachments.push({
        fileUrl: uploaded.url,
        fileName: req.file.originalname
        });

    await task.save();
  }
}
    await Notification.create({
    userId: assignedTo,
    type: "task_assigned",
    title: "New Task Assigned",
    message: `You got a new task: ${title}`,
    relatedId: task._id,
    createdBy: req.user._id
    });

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


const getAllTasks = asyncHandler(async (req,res)=>{

    let tasks

    if(["hr","super_admin"].includes(req.user.role)){
        tasks = await Task.find()
        .populate("assignedTo","name email")
        .populate("assignedBy","name")
        .populate("comments.user", "name")
        .populate("updates.updatedBy", "name")
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
    .populate("comments.user","name")

    return res
    .status(200)
    .json(new ApiResponse(200,tasks,"Employee tasks fetched"))

})



const addComment = asyncHandler(async (req, res) => {
  const { message } = req.body;

  if (!message) {
    throw new ApiError(400, "Comment message required");
  }

  const task = await Task.findById(req.params.id);

  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  task.comments.push({
    message,
    user: req.user._id
  });

  await task.save();

  // Notification Logic
  let notifyUserId;

  if (req.user._id.toString() === task.assignedTo.toString()) {
    // 👨‍💻 Employee commented → notify HR/Admin
    notifyUserId = task.assignedBy;
  } else {
    // 👨‍💼 HR/Admin commented → notify Employee
    notifyUserId = task.assignedTo;
  }

  await Notification.create({
    userId: notifyUserId,
    type: "task_comment",
    title: "New Comment",
    message: `${req.user.name} commented on task`,
    relatedId: task._id,
    createdBy: req.user._id
  });

  return res.status(200).json(
    new ApiResponse(200, task, "Comment added")
  );
});




const addTaskUpdate = asyncHandler(async (req,res)=>{
    const taskId = req.params.id
    const {message,progress } = req.body

    const task = await Task.findById(taskId)

    if(!task){
        throw new ApiError(404,"Task not found")
    }

    const progressNum = Number(progress);
        if(progressNum < 0 || progressNum > 100){
    throw new ApiError(400,"Progress must be between 0-100");
    }

    let status = "pending";

    if(progressNum > 0 && progressNum < 100){
    status = "in_progress"
    } else if(progressNum === 100){
    status = "completed"
    }

    task.progress = progressNum
    task.status = status

    task.updates.push({
        message,
        progress, // 🔥 NEW
        updatedBy: req.user._id,
        date: new Date()
    })

    await task.save()
    const notification = await Notification.create({
        userId: task.assignedBy,
        type: "task_update_added",
        title: "New Task Update",
        message: `${message} (${progress}%)`,
        relatedId: task._id,
        createdBy: req.user._id
        });

    if(!notification){
        throw new ApiError(404,"notification not found")
    }

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
addComment,
addTaskUpdate,
deleteTask
}