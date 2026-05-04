import mongoose from "mongoose";

const companySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true,
    unique: true
  },

  plan: {
    type: String,
    enum: ["free", "pro"],
    default: "free"
  },
  subscriptionType: {
  type: String,
  enum: ["monthly", "yearly"],
  default: null
},

subscriptionStatus: {
  type: String,
  enum: ["active", "expired"],
  default: "active"
},

  isActive: {
    type: Boolean,
    default: true
  }

}, { timestamps: true });

export const Company = mongoose.model("Company", companySchema); 