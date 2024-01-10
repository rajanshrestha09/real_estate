import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { Agent } from "../models/agents.model.js"
import { Property } from "../models/properties.model.js"

const addProperties = asyncHandler(async (req, res) => {

    const {
        title,
        description,
        address,
        city,
        state,
        zip,
        price,
        squareFootage,
        bedroom,
        bathroom,
        garage,
        yearBuilt,
        status,
    } = req.body

    if ([title,
        description,
        address,
        city,
        state,
        zip,
        price,
        squareFootage,
        bedroom,
        bathroom,
        garage,
        yearBuilt,
        status
    ].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All fields are required")
    }

    const agent = await Agent.findById(req.agent?._id);

    if (!agent) {
        throw new ApiError(400, "Please login first")
    }

    const localPropertiesImage = req.files;
    console.log(localPropertiesImage[0]);
    console.log(localPropertiesImage[1]);


    if (!localPropertiesImage) {
        throw new ApiError(400, "Please upload images of property")
    }

    const cloudinaryPropertiesImageOne = await uploadOnCloudinary(localPropertiesImage[0]?.path)
    const cloudinaryPropertiesImageTwo = await uploadOnCloudinary(localPropertiesImage[1]?.path)

    if (!cloudinaryPropertiesImageOne && !cloudinaryPropertiesImageTwo) {
        throw new ApiError(400, "Upload properteies image failed")
    }

    const properties = await Property.create({
        title,
        description,
        address,
        city,
        state,
        zip,
        price,
        squareFootage,
        bedroom,
        bathroom,
        garage,
        yearBuilt,
        status,
        agentId: agent?._id,
        propertyImages: [cloudinaryPropertiesImageOne?.url, cloudinaryPropertiesImageTwo?.url]
    })

    const propertiesAdd = await Property.findById(properties._id)
    if (!properties) {
        throw new ApiError(500, "Something went wrong while adding property details")
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                propertiesAdd,
                "Property details added successfully"

            )
        )

})

const updatePropertiesDetails = asyncHandler(async (req, res) => {
    const { propertyId } = (req.params);
    if (!propertyId) {
        throw new ApiError(400, "Please provide valid property Id")
    }
    const {
        title,
        description,
        address,
        city,
        state,
        zip,
        price,
        squareFootage,
        bedroom,
        bathroom,
        garage,
        yearBuilt,
        status,
    } = req.body;

    // console.log(title);

    if (!title || !description || !address || !city || !state || !zip || !price || !squareFootage || !bedroom || !bathroom || !garage || !yearBuilt || !status) {
        throw new ApiError(400, "All fields are required")
    }

    const updateProperty = await Property.findByIdAndUpdate(propertyId,
        {
            $set: {
                title,
                description,
                address,
                city,
                state,
                zip,
                price,
                squareFootage,
                bedroom,
                bathroom,
                garage,
                yearBuilt,
                status,
            }
        },
        { new: true }
    )

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                updateProperty,
                "Property Details update successfully"
            )
        )



})


export { addProperties, updatePropertiesDetails }