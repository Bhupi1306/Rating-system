import mongoose from "mongoose"

const ratingSchema = new mongoose.Schema({
    followingEsgStandards: {
        type: String,
        required: true,
    },
    
    distance: {
        type: String,
        required: true,
    },
    
    deliveryPeriodEfficiency: {
        type: Number,
        required: true,
        min: [0, "Value can't be less than 1"],
        max: [5, "Value can't be more than 5"],
    },
    
    qualityOfProduct: {
        type: Number,
        required: true,
        min: [0, "Value can't be less than 1"],
        max: [5, "Value can't be more than 5"],
    },
    
    certificationOfProducts: {
        type: String,
        required: true,
    },
    
    creditFacilityBySupplier: {
        type: String,
        required: true,
    },
    
    innovationAbility: {
        type: Number,
        required: true,
        min: [0, "Value can't be less than 1"],
        max: [5, "Value can't be more than 5"],
    },
    
    productionCapacity: {
        type: Number,
        required: true,
        min: [0, "Value can't be less than 1"],
        max: [5, "Value can't be more than 5"],
    },
    
    customerSupportIndex: {
        type: Number,
        required: true,
        min: [0, "Value can't be less than 1"],
        max: [5, "Value can't be more than 5"],
    },
    

    

}, {timestamps: true})

export const SupplierRating = mongoose.model("SupplierRating",ratingSchema)