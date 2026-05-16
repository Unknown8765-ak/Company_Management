import { User } from "../models/user.model.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { Department } from "../models/departments.model.js"



const createHR = asyncHandler(async (req, res) => {

    if(!req.user){
throw new ApiError(401,"Unauthorized request")
}
    if(req.user.role !== "admin"){
        throw new ApiError(403, "Only Super Admin can create HR")
    }

    const { name, email, password, department, dob } = req.body

    if(!name || !email || !password){
        throw new ApiError(400, "Required fields missing")
    }

    const existingUser = await User.findOne({ email })

    if(existingUser){
        throw new ApiError(409, "User already exists")
    }
    const departmentData = await Department.findOne({ name: department,company: req.user.company })
    console.log(departmentData._id);
    console.log(departmentData);
    
    if(!departmentData){
        throw new ApiError(404, "Department not found")
    }
    const hr = await User.create({
        name,
        email,
        password,
        department : departmentData._id,
        dob,
        role: "hr",
        createdBy: req.user._id,
        company: req.user.company
    })
    console.log(hr._id)
    departmentData.members.push(hr._id)
    departmentData.manager = hr._id 
    departmentData.totalEmployees += 1

    console.log(departmentData);
    await departmentData.save()
    return res
    .status(201)
    .json(new ApiResponse(201, hr, "HR created successfully"))

})



const createEmployee = asyncHandler(async (req, res) => {

    if(!["hr", "admin"].includes(req.user.role)){
        throw new ApiError(403, "Not allowed")
    }

    const { name, email, password, department, dob } = req.body

    if(!name || !email || !password){
        throw new ApiError(400, "Required fields missing")
    }

    const existingUser = await User.findOne({ email })

    if(existingUser){
        throw new ApiError(409, "User already exists")
    }
    const departmentData = await Department.findOne({ name: department,company: req.user.company })
    console.log(departmentData);
    console.log(departmentData._id);
    
    if(!departmentData){
        throw new ApiError(404, "Department not found")
    }
    const employee = await User.create({
        name,
        email,
        password,
        department : departmentData._id,
        dob,
        role: "employee",
        createdBy: req.user._id,
        company: req.user.company
    })
    departmentData.members.push(employee._id)
    departmentData.totalEmployees += 1

    await departmentData.save()
    return res
    .status(201)
    .json(new ApiResponse(201, employee, "Employee created successfully"))

})



/*
-------------------------
Get All Employees
-------------------------
*/

const getAllEmployees = asyncHandler(async (req, res) => {

    const employees = await User.find({ role: "employee",company: req.user.company })
    .populate("department", "name")

    return res
    .status(200)
    .json(new ApiResponse(200, employees, "Employees fetched successfully"))

})

const getAllHR = asyncHandler(async (req, res) => {

    const employees = await User.find({ role: "hr",company: req.user.company })
    .populate("department", "name")

    return res
    .status(200)
    .json(new ApiResponse(200, employees, "Employees fetched successfully"))

})



/*
-------------------------
Get Single Employee
-------------------------
*/

const getSingleEmployee = asyncHandler(async (req, res) => {

    const { id } = req.params

    const employee = await User.findOne({_id: id,
    company: req.user.company})
    .populate("department", "name")

    if(!employee){
        throw new ApiError(404, "Employee not found")
    }

    return res
    .status(200)
    .json(new ApiResponse(200, employee, "Employee fetched successfully"))

})



/*
-------------------------
Update Employee
-------------------------
*/

const updateEmployee = asyncHandler(async (req, res) => {
    if(!["hr", "admin"].includes(req.user.role)){
        throw new ApiError(403, "Not allowed")
    }
    const { id } = req.params

    const employee = await User.findOne({
    _id: id,
    company: req.user.company
})

    if(!employee){
        throw new ApiError(404, "Employee not found")
    }

    const oldDepartment = employee.department
    const newDepartment = req.body.department

    if(newDepartment && oldDepartment.toString() !== newDepartment){

        await Department.findOneAndUpdate(
            { _id: oldDepartment, company: req.user.company },
            {
                $pull: { members: employee._id },
                $inc: { totalEmployees: -1 }
            }
        )

        await Department.findByIdAndUpdate(
            newDepartment,
            {
                $push: { members: employee._id },
                $inc: { totalEmployees: 1 }
            }
        )
    }

    const updatedEmployee = await User.findByIdAndUpdate(
        id,
        req.body,
        { new: true }
    )

    return res
    .status(200)
    .json(new ApiResponse(200, updatedEmployee, "Employee updated successfully"))

})



/*
-------------------------
Delete Employee
-------------------------
*/

const deleteEmployee = asyncHandler(async (req, res) => {
    
    if(!["hr", "admin"].includes(req.user.role)){
        throw new ApiError(403, "Not allowed")
    }

    const { id } = req.params

    const employee = await User.findOne({
    _id: id,
    company: req.user.company
})
    if(!employee){
        throw new ApiError(404, "Employee not found")
    }

    await Department.findOneAndUpdate(
  { _id: employee.department, company: req.user.company },
  {
    $pull: { members: employee._id },
    $inc: { totalEmployees: -1 }
  }
)

    await employee.deleteOne()

    return res
    .status(200)
    .json(new ApiResponse(200, {}, "Employee deleted successfully"))

})



export {
    createHR,
    createEmployee,
    getAllEmployees,
    getSingleEmployee,
    updateEmployee,
    deleteEmployee,
    getAllHR
}