import mongoose from "mongoose"

const supplierSchema = new mongoose.Schema({
    
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


    rating: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SupplierRating"
    },

    monthYear: {
        type: String,
    }
},{timestamps: true})

export const Supplier = mongoose.model("Supplier",supplierSchema)