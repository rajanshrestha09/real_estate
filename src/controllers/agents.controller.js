import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import{uploadOnCloudinary} from "../utils/cloudinary.js"
import {Agent} from "../models/agents.model.js"





const registerAgent = asyncHandler(async (req, res)=>{
    const {firstName, lastName} = req.body;
    console.log(firstName, lastName)
})






export {
    registerAgent
}