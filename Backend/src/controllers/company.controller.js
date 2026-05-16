import mongoose from "mongoose";
import { Company } from "../models/company.model.js";
import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const createCompany = asyncHandler(async (req, res) => {

  if (req.user.role !== "super_admin") {
    throw new ApiError(403, "Only super admin can create company");
  }

  const {
    name,
    email,
    plan,
    adminName,
    adminEmail,
    adminPassword
  } = req.body;

  if (!name || !email || !adminName || !adminEmail || !adminPassword) {
    throw new ApiError(400, "All fields are required including admin details");
  }

 
  const existingCompany = await Company.findOne({ email });
  if (existingCompany) {
    throw new ApiError(409, "Company already exists");
  }

  const existingAdmin = await User.findOne({ email: adminEmail });
  if (existingAdmin) {
    throw new ApiError(409, "Admin already exists with this email");
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {

    
    const [createdCompany] = await Company.create([{
      name,
      email,
      plan: plan || "free"
    }], { session });

    
    const [admin] = await User.create([{
      name: adminName,
      email: adminEmail,
      password: adminPassword,
      role: "admin",
      company: createdCompany._id
    }], { session });

   
    createdCompany.admin = admin._id;
    await createdCompany.save({ session });

    await session.commitTransaction();
    session.endSession();

    return res.status(201).json(
      new ApiResponse(201, {
        company: createdCompany,
        admin
      }, "Company & Admin created successfully")
    );

  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw new ApiError(500, error.message || "Transaction failed");
  }

});

const getAllCompanies = asyncHandler(async (req, res) => {

  if (req.user.role !== "super_admin") {
    throw new ApiError(403, "Not allowed");
  }

  const companies = await Company.find().sort({ createdAt: -1 });

  return res.status(200).json(
    new ApiResponse(200, companies, "All companies fetched")
  );
});

const getCompanyById = asyncHandler(async (req, res) => {

  if (req.user.role !== "super_admin") {
    throw new ApiError(403, "Not allowed");
  }

  const { id } = req.params;

  const company = await Company.findById(id);

  if (!company) {
    throw new ApiError(404, "Company not found");
  }

  return res.status(200).json(
    new ApiResponse(200, company, "Company fetched")
  );
});

const deleteCompany = asyncHandler(async (req, res) => {

  if (req.user.role !== "super_admin") {
    throw new ApiError(403, "Not allowed");
  }

  const { id } = req.params;

  const company = await Company.findById(id);

  if (!company) {
    throw new ApiError(404, "Company not found");
  }

  await User.deleteMany({ company: id });

  await company.deleteOne();

  return res.status(200).json(
    new ApiResponse(200, {}, "Company deleted successfully")
  );
});

const updateCompany = asyncHandler(async (req, res) => {

  if (req.user.role !== "super_admin") {
    throw new ApiError(403, "Not allowed");
  }

  const { id } = req.params;
  const { name, email, plan, isActive } = req.body;

  const company = await Company.findById(id);

  if (!company) {
    throw new ApiError(404, "Company not found");
  }

  if (email && email !== company.email) {
    const emailExists = await Company.findOne({ email });
    if (emailExists) {
      throw new ApiError(409, "Email already in use");
    }
  }

  company.name = name || company.name;
  company.email = email || company.email;
  company.plan = plan || company.plan;

  if (typeof isActive === "boolean") {
    company.isActive = isActive;
  }

  await company.save();

  return res.status(200).json(
    new ApiResponse(200, company, "Company updated")
  );
});

export {
    createCompany,
    getAllCompanies,
    getCompanyById,
    updateCompany,
    deleteCompany
}