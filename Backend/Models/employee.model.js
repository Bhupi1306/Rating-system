import mongoose from "mongoose"

const employeeSchema = new mongoose.Schema({
    
    id: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    
    fullName:{
        type: String,
        required: true,
        trim: true
    },

    password: {
        type: String,
        required: true
    },

    department: {
        type: String,
        required: true
    },


    rating: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Rating"
    },

    monthYear: {
        type: String,
    },

    feedbackMonthYear: {
        type: String
    }

},{timestamps: true})

export const Employee = mongoose.model("Employee",employeeSchema)