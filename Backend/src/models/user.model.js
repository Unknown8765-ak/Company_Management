import mongoose from "mongoose"
import jwt from "jsonwebtoken"


const userSchema = new mongoose.Schema(
{
  
  name: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true,
    unique: true
  },

  password: {
    type: String,
    required: true
  },

  role: {
    type: String,
    enum: ["super_admin", "hr", "employee","admin"],
    default: "employee"
  },

  company: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Company",
  required: true
  },

  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Department"
  },

  dob: {
    type: Date
  },

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "active"
  }
},
{ timestamps: true }
);




userSchema.methods.generateAccessToken = async function () {
    return jwt.sign(
        {
        _id : this._id,
        email : this.email,
        name : this.name,
        company: this.company,
        role: this.role 
        },process.env.ACCESS_TOKEN_SECRET,
        
        {
            expiresIn : process.env.ACCESS_TOKEN_EXPIRY
        }
    );
};

userSchema.methods.generateRefreshToken = async function () {
    return jwt.sign(
        {
            _id : this._id
        },process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn : process.env.REFRESH_TOKEN_EXPIRY
        }
);
};

export const User = mongoose.model("User" , userSchema)


