import mongoose from "mongoose"

const employeeSchema = new mongoose.Schema({
    
    id: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        index: true
    },
    
    fullName:{
        type: String,
        required: true,
        trim: true
    },

    rating: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Rating"
    }
},{timestamps: true})

export const Employee = mongoose.model("Employee",employeeSchema)