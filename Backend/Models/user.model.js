
import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
    fullName:{
        type: String,
        required: true,
        trim: true,
    },

    email: {
        type: String,
        required: true,
        lowercase: true,
        unique: true,
        trim: true
    },

    password: {
        type: String,
        required: true
    },

    isAdmin: {
        type: Boolean,
        default: false
    },

    webAccess :  {
        type: String,
        required: true
    },

    refreshToken: {
        type: String
    }



},{timestamps:true})

export const User = mongoose.model("User",userSchema)