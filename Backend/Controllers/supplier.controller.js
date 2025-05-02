import {json2csv} from "json-2-csv"
import {supplierDepartments, supplierRatingLabels} from "../Utils/constants.util.js"
import { Supplier } from "../Models/suppliers/suppliers.model.js"
import { SupplierRating } from "../Models/suppliers/supplierRating.model.js"


const addsupplier = async (req,res) =>
{
    try {
        const {id, fullName, department} = req.body
    
        const supplierExist = await Supplier.findOne({id})
        
        if(supplierExist) {
            return res.status(409).json({message: "Supplier already Exists", success: false})
        }
        
        const newSupplier = new Supplier({id, fullName, department})
        await newSupplier.save()

        return res.status(201).json({message: "Supplier Added succesfully", success: true})
    
    } catch (error) {
        res.status(405).json({message: "Something went wrong", success: false, error: error})
    }
}

const checkSupplier = async (req,res) => {
    try {
        const {id} = req.body
        if(!id) {
            return res.status(409).json({message: "Invalid Id", success: false})
        }
    
        const supplier = await Supplier.findOne({id})
    
        if(!supplier)
        {
            return res.status(409).json({message: "Supplier does not exist", success: false})
        }

        res.status(201).json({
            message: "Supplier exists",
            id: supplier.id,
            fullName: supplier.fullName,
            department: supplier.department,
            success: true
        })


    } catch (error) {
        res.status(405).json({message: "Something went wrong checking if supplier exists", success: false, error: error})
    }
}

const deleteSupplier = async (req,res) => 
{
    try {
        const {id} = req.body
        if(!id) {
            return res.status(409).json({message: "Invalid Id", success: false})
        }
    
        await Supplier.findOneAndDelete({id})

        const checkSupplier = await Supplier.findOne({id})

        if(checkSupplier)
        {
            return res.status(409).json({message: "Something went wrong in deleting Supplier", success: false})
        }
    


        res.status(201).json({
            message: "Supplier deleted",
            success: true
        })


    } catch (error) {
        res.status(405).json({message: "Something went wrong while deleting a Supplier", success: false, error: error})
    }
}

const showSupplierRating = async(req,res) => 
{
    const curMonth = new Date().toLocaleString("default",{month: "long"})
    const year = new Date().getFullYear()
    const monthYear = curMonth + year
    const dept = supplierDepartments 

    try {
        const {department} = req.body
        const checkDept = dept.includes(department)
        
        if(!checkDept)
        {
            return res.status(400).json({message: "invalid Department", success: false})
        }

        const supplier = await Supplier.find({
            $and: [
                {department: department},
                {monthYear:{$ne: monthYear}}
            ]
        }).select('-rating')

        if(!supplier) 
        {
            return res.status(400).json({message: "No Supplier found", success: false})
        }
        res.status(200).json(
            {
                message: "Supplier found",
                supplier,
                success: true
            }
        )


        

        
    } catch (error) {
        res.status(400).json({message: "Something went wrong", error})
    }
}

const rateSupplier = async(req,res) => 
{


    try {
        const {id, ratings, monthYear} = req.body

        const newSupplierRating = await SupplierRating.create(ratings)
        
        const updateSupplier = await Supplier.findOneAndUpdate(
            {id},
            {
                $set:{
                    rating: newSupplierRating._id,
                    monthYear: monthYear
                }
            },
            {new: true}
        ).populate('rating')
    
        res.status(201).json({message: "Supplier Ratings updated successfully", success: true})
    } catch (error) {
        res.status(400).json({message: "Fault in Supplier Rating updation",error, success: false})
    }

}

const downloadSupplierRating = async (req,res) => 
    {
        const {selectedDepartment} = req.body
        const curMonth = new Date().toLocaleString("default",{month: "long"})
        const year = new Date().getFullYear()

        const labels = supplierRatingLabels

        if(!selectedDepartment)
        {
            res.status(402).json({message: "Department is required", success: false})
        }

        try {
            const suppliers = await Supplier.find({department: selectedDepartment}).populate('rating').lean()
            const data = suppliers.map(supplier => 
            {
                const row = {
                    Id: supplier.id,
                    Name: supplier.fullName,
                }

                
                labels.forEach(label => {
                    if(supplier.rating[label] === 0 || supplier.rating[label] === "0"){
                        row[label] = "N/A"
                    }
                    else{
                    row[label] = supplier.rating?.[label] || "N/A"
                }
                })
                return row
            }
            )
            const csv = `Month,${curMonth} ${year}\n` + json2csv(data);
            res.header("Content-type", 'text/csv')
            res.attachment(`${selectedDepartment}_supplier_rating.csv`)
            res.send(csv)

        } catch (error) {
            res.status(400).json({message: "Something went wrong", success: false, error })
        }
        
    }

const getSupplierRatingLabels = (req,res) =>{
    res.json({supplierRatingLabels, shownDepartments:supplierDepartments})
}

export {
    addsupplier,
    checkSupplier,
    deleteSupplier,
    showSupplierRating,
    rateSupplier,
    downloadSupplierRating,
    getSupplierRatingLabels
}