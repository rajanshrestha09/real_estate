import mongoose, { Schema } from "mongoose";
import bcypt from "bcrypt";
import jwt from "jsonwebtoken"


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
        refreshToken: {
            type: String
        }
    },
    {
        timestamps: true
    }
)

agentSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcypt.hash(this.password, 10);
    next();
})

agentSchema.methods.isPasswordCorrect = async function (password) {
    return await bcypt.compare(password, this.password)
}

agentSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            firstName: this.firstName
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}



agentSchema.methods.generateRefreshToken = function () {
    jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}



export const Agent = mongoose.model("Agent", agentSchema)
