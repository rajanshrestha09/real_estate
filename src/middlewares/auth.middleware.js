import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { Agent } from "../models/agents.model.js";


export const verifyJWT = asyncHandler(async (req, _, next) => {
    try {
        console.log(req);
        const token = req.cookies?.accessToken || req.header("Aurhorization")?.replace("Bearer", "")
        console.log("Token: ", token);

        if(!token){
            throw new ApiError(401, "Unauthorized request")
        }

       const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

       const agent = await Agent.findById(decodedToken?._id).select("-password -refreshToken")

       if(!agent){
        throw new ApiError(401, "Invalid Access Token")
       }

       req.agent = agent

       next()

    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid access token")
    }
})