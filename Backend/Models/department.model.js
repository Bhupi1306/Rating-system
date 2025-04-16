import mongoose from "mongoose"

const departmentSchema = new mongoose.Schema({
    departmentName: {
        type: String,
        enum: {
            values: ["Dept1", "Dept2"],
            message: `${value} is not supported`
        },
        required: true
    },

    head: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Head"
        }
    ],

    employees: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Employee"
        }
    ]
})

export const Department = mongoose.model("Department",departmentSchema)