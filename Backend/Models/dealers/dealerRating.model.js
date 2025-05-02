import mongoose from "mongoose"

const dealerRatingSchema = new mongoose.Schema({
    salesTurnover: {
        type: String,
        required: true,
    },
    
    serviceTime: {
        type: Number,
        required: true,
        min: [0, "Value can't be less than 1"],
        max: [5, "Value can't be more than 5"],
    },
    
    customerRelationsIndex: {
        type: Number,
        required: true,
        min: [0, "Value can't be less than 1"],
        max: [5, "Value can't be more than 5"],
    },
    
    insuranceSettlement: {
        type: Number,
        required: true,
        min: [0, "Value can't be less than 1"],
        max: [5, "Value can't be more than 5"],
    },
    
    financeFacilities: {
        type: Number,
        required: true,
        min: [0, "Value can't be less than 1"],
        max: [5, "Value can't be more than 5"],
    },
    
    staffTraining: {
        type: Number,
        required: true,
        min: [0, "Value can't be less than 1"],
        max: [5, "Value can't be more than 5"],
    },
    
    staffBehaviour: {
        type: Number,
        required: true,
        min: [0, "Value can't be less than 1"],
        max: [5, "Value can't be more than 5"],
    },
    
    followingEsgGuidelines: {
        type: Number,
        required: true,
        min: [0, "Value can't be less than 1"],
        max: [5, "Value can't be more than 5"],
    },
    

    

}, {timestamps: true})

export const DealerRating = mongoose.model("DealerRating",dealerRatingSchema)