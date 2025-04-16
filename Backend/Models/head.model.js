import mongoose from "mongoose"

const headSchema = new mongoose.Schema({
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

    refreshToken: {
        type: String
    }



},{timestamps:true})

export const Head = mongoose.model("Head",headSchema)