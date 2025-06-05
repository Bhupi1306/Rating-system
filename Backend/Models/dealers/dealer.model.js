import mongoose from "mongoose"

const dealerSchema = new mongoose.Schema({
    
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

    department: {
        type: String,
        required: true
    },

    password: {
        type: String,
        required: true
    },


    rating: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "DealerRating"
    },

    monthYear: {
        type: String,
    },

    feedbackMonthYear: {
        type: String
    }
},{timestamps: true})

export const Dealer = mongoose.model("Dealer",dealerSchema)