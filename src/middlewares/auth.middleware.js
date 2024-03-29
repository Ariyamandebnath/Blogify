import ApiError from "../utils/ApiErrors.js";
import asyncHandler from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import {User} from "../models/user.models.js"
export const verifyJWT = asyncHandler(async (req, res, next)=>{
    try {
        const token =req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer","")
        if(!token){
            throw new ApiError(401, "Unauthorized request")
            }
    
        const decodedAccessToken=jwt.verify(token , process.env.ACCESS_TOKEN_SECRET)
    
        const user =await User.findById(decodedAccessToken?._id).select("-password -refreshToken")
    
        if(!user){
            throw new ApiError(401, "Invalid access Token")
        }
        req.user = user;
        next()
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid access token")
        
    }

})
export const generateAccessAndRefreshTokens = async(userId)=>{
    try {
       const user= await User.findById(userId)
       const accessToken = user.generateAccessToken()
       const refreshToken = user.generateRefreshToken()

       user.refreshToken = refreshToken
       await user.save({validateBeforeSave: false})

       return {accessToken, refreshToken}

    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating refresh and access token")
        
    }
}