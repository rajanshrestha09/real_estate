import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { Agent } from "../models/agents.model.js"
import jwt from "jsonwebtoken"

const generateAccessAndRefreshToken = async (agentId) => {
    try {
        const agent = await Agent.findById(agentId)
        const accessToken = agent.generateAccessToken()
        const refreshToken = agent.generateRefreshToken()

        agent.refreshToken = refreshToken // add refreshToken into database
        await agent.save({ validateBeforeSave: false })

        console.table(`Access token: ${accessToken} &&& Refresh token: ${refreshToken}`);

        return { accessToken, refreshToken }
    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating refresh and access token")
    }
}


// ======== Register Agent ===============
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

// ======== Login Agent ===============
const loginAgent = asyncHandler(async (req, res) => {
    const { email, licenseNumber, password } = req.body
    // console.log(email, licenseNumber, password); 

    if (!email && !licenseNumber) {
        throw new ApiError(400, "email or licenseNumber is required")
    }

    const agent = await Agent.findOne({
        $or: [{ email }, { licenseNumber }]
    })

    if (!agent) {
        throw new ApiError(400, "User doesn't exist")
    }

    const isPasswordValid = await agent.isPasswordCorrect(password)
    if (!isPasswordValid) {
        throw new ApiError(400, "Invalid password")
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(agent._id)

    const loggedInAgent = await Agent.findById(agent._id).select("-password -refreshToken")

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                { agent: loggedInAgent, accessToken, refreshToken },
                "Agent logged In successfully"
            )
        )

})

// ======== Logout Agent ===============
const logoutAgent = asyncHandler(async (req, res) => {
    await Agent.findByIdAndUpdate(
        req.agent._id,
        {
            $unset: {
                refreshToken: 1 //This removes the field from document
            }
        },
        {
            new: true
        }
    )
    const options = {
        httpOnly: true,
        secure: true
    }

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "User logged out"))
})

const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies?.refreshToken || req.body.refreshToken

    if (!incomingRefreshToken) {
        throw new ApiError(401, "Unauthorized requrest")
    }

    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )

        const agent = await Agent.findById(decodedToken._id)
        if (!agent) {
            throw new ApiError(400, "Invalid refresh token")
        }

        if (incomingRefreshToken !== agent?.refreshToken) {
            throw new ApiError(400, "Refresh token is expired or used")
        }

        const options = {
            httpOnly: true,
            secure: true
        }

        const { accessToken, newRefreshToken } = await generateAccessAndRefreshToken(agent._id)

        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", newRefreshToken, options)
            .json(
                new ApiResponse(
                    200,
                    {accessToken, refreshToken: newRefreshToken},
                    "Access token refresher"
                )
            )

    } catch (error) {
        throw new ApiError(400, error?.message || "Invalid refresh token")
    }
})


export {
    registerAgent,
    loginAgent,
    logoutAgent,
    refreshAccessToken
}