import mongoose from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import {ApiError} from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const generateAccessAndRefereshTokens = async(userId) =>{
    try {
        const user = await User.findById(userId)
        // console.log("USER 👉", user)
        const accessToken = await user.generateAccessToken()
        const refreshToken = await user.generateRefreshToken()
        // console.log("ACCESS", accessToken)
        // console.log("REFRESH", refreshToken)

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return {accessToken, refreshToken}


    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating referesh and access token")
    }
}


const login = asyncHandler(async (req,res)=>{


    const { email , password } = req.body

    if (!email || !password) {
        throw new ApiError(409, "Email and password is required");
    }
    const existedUser = await User.findOne({email})
    if (!existedUser) {
        throw new ApiError(404 , "user not found");
    }
    // console.log(existedUser)
    
    if(password !== existedUser.password){
    throw new ApiError(401 , "Invalid credentials")
}

    const { accessToken , refreshToken } = await generateAccessAndRefereshTokens(existedUser._id)
//     console.log("ACCESS", accessToken)
// console.log("REFRESH", refreshToken)
    const loggedInUser = await User.findOne({email}).select(
        "-password -refreshToken"
    )

    const options  = {
        httpOnly : true,
        secure: true,        // ✅ MUST in production
  sameSite: "none",
        maxAge: 7 * 24 * 60 * 60 * 1000
    }

    return res.status(200)
    .cookie("accessToken" , accessToken , {...options , maxAge : 15 * 60 * 1000})
    .cookie("refreshToken" , refreshToken , options)
    .json(
        new ApiResponse(200 , 
            {
                user : loggedInUser , accessToken , refreshToken

            },
             "User Logged In successfully")
    )
})

const logout = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user?._id,
    {
      $unset: {
        refreshToken: 1,
      },
    },
    {
      returnDocument: "after",
    }
  );

  const options = {
    httpOnly: true,
    secure: true,        // ✅ MUST in production
  sameSite: "none",
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logout successfully"));
});
const getCurrentUser = asyncHandler(async (req , res)=>{
    if (!req.user) {
        throw new ApiError(401 , "Unauthorized ")
    }
    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            req.user,
            "User fetch successfully"
        )
    )
})

export {
    login,
    logout,
    getCurrentUser
}