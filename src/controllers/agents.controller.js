import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { Agent } from "../models/agents.model.js"

const generateAccessAndRefreshToken = async (agentId) => {
    try {
        const agent = await Agent.findById(agentId)
        const accessToken = agent.generateAccessToken()
        const refreshToken = agent.generateRefreshToken()

        agent.refreshToken = refreshToken
        await agent.save({ validateBeforeSave: false })

        return { accessToken, refreshToken }
    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating refresh and access token")
    }
}



const registerAgent = asyncHandler(async (req, res) => {
    const { firstName, lastName, email, password, phone, licenseNumber } = req.body;
    // console.log(firstName, lastName, password)
    if ([firstName, lastName, email, password, phone, licenseNumber].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All fields are required!")
    }

    const existedAgent = await Agent.findOne({
        $or: [{ email }, { licenseNumber }]
    })

    if (existedAgent) {
        throw new ApiError(400, `Agent with ${email} or ${licenseNumber} already exist`)
    }

    const localProfileImage = req.files?.profileImage[0]?.path;

    if (!localProfileImage) {
        throw new ApiError(400, "Profile Image is required")
    }

    const profileImage = await uploadOnCloudinary(localProfileImage)
    // console.log(profileImage);

    if (!profileImage) {
        throw new ApiError(400, "Error while profile image upload on cloudinary")
    }

    const agent = await Agent.create({
        firstName,
        lastName,
        email,
        password,
        phone,
        licenseNumber,
        profileImage: profileImage?.url || ""
    })

    const agentCreated = await Agent.findById(agent._id).select("-password")
    if (!agentCreated) {
        throw new ApiError(500, "Something went wrong while creating agent")
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            agentCreated,
            "Agent registered Successfully"
        )
    )
})






export {
    registerAgent
}