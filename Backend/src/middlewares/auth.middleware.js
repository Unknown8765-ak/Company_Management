import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken"
import { User } from "../models/user.model.js";

export const verifyJWT = asyncHandler(async(req, _, next) => {
    try {
        // console.log("COOKIES ", req.cookies);
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
        // console.log(token);
        if (!token) {
            throw new ApiError(401, "Unauthorized request")
        }
        // console.log("TOKEN ", token)
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        // console.log("DECODED ", decodedToken)
    
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken")
    
        if (!user) {
            
            throw new ApiError(401, "Invalid Access Token")
        }
        // console.log("USER ", user)
    
        req.user = user;
        next()
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid access token")
    }
    
})