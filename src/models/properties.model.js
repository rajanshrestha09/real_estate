import mongoose, { Schema } from "mongoose";

const propertiesSchecma = new Schema({
    agentId:{
        type: Schema.Types.ObjectId,
        ref: "Agent"
    },
    title:{
        type: String,
        trim: true,
        required: [true, "Title is required"]
    },
    description:{
        type: String,
        trim: true,
        required: [true, "Description is required"]
    },
    address:{
        type: String,
        trim: true,
        required: [true, "Address is required"]
    },
    city:{
        type: String,
        trim: true,
        required: [true, "City is required"]
    },
    state:{
        type: String,
        trim: true,
        required: [true, "State is required"]
    },
    zip:{
        type: String,
        trim: true,
        required: [true, "Zip is required"]
    },
    price:{
        type: Number,
        required: [true, "Price is required"]
    },
    squareFootage:{
        type: Number,
        required: [true, "Area is required"]
    },
    bedroom:{
        type: Number,
        required: [true, "Bedroom is required"]
    },
    bathroom:{
        type: Number,
        required: [true, "Bathroom is required"]
    },
    garage:{
        type: Number || Boolean,
        required: [true, "Garage is required"]
    },
    yearBuilt:{
        type: Number,
        required: [true, "Build Year"]
    },
    status:{
        type: String
    },
    propertyImages:[{
        type: Array,
        required:[true, "Property images required"]
    }]
    
},
{timestamps: true}
)


export const Property = mongoose.model("Property", propertiesSchecma)