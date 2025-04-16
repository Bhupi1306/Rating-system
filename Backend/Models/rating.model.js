import mongoose from "mongoose"

const ratingSchema = new mongoose.Schema({
    productivity: {
        type: Number,
        required: true,
        min: [1, "Value can't be less than 1"],
        max: [5, "Value can't be more than 5"],
    },
    
    WorksEthics: {
        type: Number,
        required: true,
        min: [1, "Value can't be less than 1"],
        max: [5, "Value can't be more than 5"],
    },
    
    professionalism: {
        type: Number,
        required: true,
        min: [1, "Value can't be less than 1"],
        max: [5, "Value can't be more than 5"],
    },
    
    learningAbility: {
        type: Number,
        required: true,
        min: [1, "Value can't be less than 1"],
        max: [5, "Value can't be more than 5"],
    },
    
    leadership: {
        type: Number,
        required: true,
        min: [1, "Value can't be less than 1"],
        max: [5, "Value can't be more than 5"],
    },
    
    teamWork: {
        type: Number,
        required: true,
        min: [1, "Value can't be less than 1"],
        max: [5, "Value can't be more than 5"],
    },
    
    attendance: {
        type: Number,
        required: true,
        min: [1, "Value can't be less than 1"],
        max: [5, "Value can't be more than 5"],
    },
    
    confidence: {
        type: Number,
        required: true,
        min: [1, "Value can't be less than 1"],
        max: [5, "Value can't be more than 5"],
    },
    
    teamBuilding: {
        type: Number,
        required: true,
        min: [1, "Value can't be less than 1"],
        max: [5, "Value can't be more than 5"],
    },
    
    growthOriented: {
        type: Number,
        required: true,
        min: [1, "Value can't be less than 1"],
        max: [5, "Value can't be more than 5"],
    },
    
    technicalKnowledge: {
        type: Number,
        required: true,
        min: [1, "Value can't be less than 1"],
        max: [5, "Value can't be more than 5"],
    },
    
    // Company-Personal Goals Compatibility
    CPGC: {
        type: Number,
        required: true,
        min: [1, "Value can't be less than 1"],
        max: [5, "Value can't be more than 5"],
    },
    
    employeeWellBeing: {
        type: Number,
        required: true,
        min: [1, "Value can't be less than 1"],
        max: [5, "Value can't be more than 5"],
    },
    
    employeeHealth: {
        type: Number,
        required: true,
        min: [1, "Value can't be less than 1"],
        max: [5, "Value can't be more than 5"],
    },
    

}, {timestamps: true})

export const Rating = mongoose.model("Rating",ratingSchema)