import mongoose from "mongoose";

const salarySchema = new mongoose.Schema({

  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
    required: true
  },

  // 🔥 Salary Month
  month: {
    type: Number, // 1 - 12
    required: true
  },

  year: {
    type: Number,
    required: true
  },

  // 🔥 FIXED SALARY (base salary)
  baseSalary: {
    type: Number,
    required: true
  },

  // 🔥 ATTENDANCE
  totalWorkingDays: {
    type: Number,
    default: 30
  },

  presentDays: {
    type: Number,
    default: 0
  },

  paidLeaves: {
    type: Number,
    default: 0
  },

  unpaidLeaves: {
    type: Number,
    default: 0
  },


  // 🔥 DEDUCTIONS
  deductions: {
    type: Number,
    default: 0
  },


  // 🔥 FINAL SALARY
  netSalary: {
    type: Number,
    default: 0
  },

  status: {
    type: String,
    enum: ["pending", "processed", "paid"],
    default: "pending"
  },

  paidAt: Date,

}, { timestamps: true });


// 🔥 UNIQUE: ek employee ki ek month ki ek hi salary ho
salarySchema.index({ employee: 1, month: 1, year: 1 }, { unique: true });


export const Salary = mongoose.model("Salary", salarySchema);