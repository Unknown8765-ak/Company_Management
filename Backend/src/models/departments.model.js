import mongoose from "mongoose";

const departmentSchema = new mongoose.Schema({

name:{
type:String,
required:true,
unique:true
},

company: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Company"
},

    description:{
type:String
},

manager:{
type:mongoose.Schema.Types.ObjectId,
ref:"User"
},

members:[
{
type:mongoose.Schema.Types.ObjectId,
ref:"User"
}
],

totalEmployees:{
type:Number,
default:0
}

},{timestamps:true})

export const Department = mongoose.model("Department",departmentSchema)