import mongoose, { Schema } from "mongoose";


const agentSchema = new Schema(
    {
        firstName: {
            type: String,
            required: true,
            trim: true
        },
        lastName: {
            type: String,
            required: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },
        password: {
            type: String,
            validate: {
                validator: function (value) {
                    return /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/.test(value)
                },
                message: props => `${props.value} is not valid password`
            },
            required: [true, "Password required"]
        },
        phone: {
            type: String,
            validate: {
                validator: function (v) {
                    return /\d{3}-\d{3}-\d{4}/.test(v);
                },
                message: props => `${props.value} is not a valid phone number!`
            },
            required: [true, 'User phone number required']
        },
        licenseNumber: {
            type: String,
            requied: [true, "License number is required"]
        },
        profileImage: {
            type: String,
        },
    },
    {
        timestamps: true
    }
)



export const Agent = mongoose.model("Agent", agentSchema)
