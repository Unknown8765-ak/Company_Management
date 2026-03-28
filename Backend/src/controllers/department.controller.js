import { Department } from "../models/departments.model.js"
import { User } from "../models/user.model.js"

import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"



const createDepartment = asyncHandler(async (req,res)=>{

if(req.user.role !== "super_admin"){
throw new ApiError(403,"Only super admin can create department")
}

const { name, description } = req.body

if(!name){
throw new ApiError(400,"Department name required")
}

// const manager = await User.findOne({
// name: hrName,
// email: hrEmail,
// role:"hr"
// })

// if(!manager){
// throw new ApiError(404,"HR not found")
// }

const department = await Department.create({
name,
description,
// manager: manager._id
})

// manager.department = department._id
// await manager.save()

return res.status(201).json(
new ApiResponse(201,department,"Department created successfully")
)

})


/*
-------------------------------
Get Departments
-------------------------------
*/

const getDepartments = asyncHandler(async (req,res)=>{

    const departments = await Department.find()
    .populate("manager","name email")
    .populate("members","name email")

    return res.status(200).json(
        new ApiResponse(200,departments,"Departments fetched")
    )

})




const updateDepartment = asyncHandler(async (req,res)=>{

    const { id } = req.params
    if(req.user.role !== "super_admin"){
throw new ApiError(403,"Only super admin can create department")
}
    const { name, description } = req.body
    if(!name){
        throw new ApiError(404,"name not found")
    }
    if(!id){
        throw new ApiError(404,"id not found")
    }

    const department = await Department.findByIdAndUpdate(
        id,
        { name, description },
        { new:true }
    )


    if(!department){
        throw new ApiError(404,"Department not found")
    }
    await User.updateMany(
        { department: id },
        { $set: { department } }
    )

    return res.status(200).json(
        new ApiResponse(200,department,"Department updated")
    )

})



/*
-------------------------------
Delete Department
-------------------------------
*/

const deleteDepartment = asyncHandler(async (req,res)=>{
    if(req.user.role !== "super_admin"){
throw new ApiError(403,"Only super admin can create department")
}

    const { id } = req.params

    const department = await Department.findById(id)

    if(!department){
        throw new ApiError(404,"Department not found")
    }
    await User.updateMany(
        { department: id },
        { $set: { department: null } }
    )

    await department.deleteOne()

    return res.status(200).json(
        new ApiResponse(200,{}, "Department deleted")
    )

})



/*
-------------------------------
Add Member to Department
-------------------------------
*/

const addMemberToDepartment = asyncHandler(async (req,res)=>{

    const { departmentId, userId } = req.body

    const department = await Department.findById(departmentId)

    if(!department){
        throw new ApiError(404,"Department not found")
    }

    const user = await User.findById(userId)

    if(!user){
        throw new ApiError(404,"User not found")
    }

    if(department.members.includes(userId)){
        throw new ApiError(400,"User already in department")
    }

    department.members.push(userId)
    department.totalEmployees += 1

    user.department = departmentId

    await department.save()
    await user.save()

    return res.status(200).json(
        new ApiResponse(200,department,"Member added to department")
    )

})



/*
-------------------------------
Transfer Employee
-------------------------------
*/

// const transferEmployee = asyncHandler(async (req,res)=>{

//     const { userId, newDepartmentId } = req.body

//     const user = await User.findById(userId)

//     if(!user){
//         throw new ApiError(404,"User not found")
//     }

//     const oldDepartmentId = user.department

//     if(oldDepartmentId){

//         await Department.findByIdAndUpdate(
//             oldDepartmentId,
//             {
//                 $pull:{members:userId},
//                 $inc:{totalEmployees:-1}
//             }
//         )

//     }

//     await Department.findByIdAndUpdate(
//         newDepartmentId,
//         {
//             $push:{members:userId},
//             $inc:{totalEmployees:1}
//         }
//     )

//     user.department = newDepartmentId

//     await user.save()

//     return res.status(200).json(
//         new ApiResponse(200,user,"Employee transferred successfully")
//     )

// })



/*
-------------------------------
Department Analytics
-------------------------------
*/

const getDepartmentAnalytics = asyncHandler(async (req,res)=>{

    const departments = await Department.find()
    .select("name totalEmployees")

    return res.status(200).json(
        new ApiResponse(200,departments,"Department analytics fetched")
    )

})



export {
createDepartment,
getDepartments,
updateDepartment,
deleteDepartment,
addMemberToDepartment,
// transferEmployee,
getDepartmentAnalytics
}