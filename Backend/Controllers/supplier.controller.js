import {json2csv} from "json-2-csv"
import {supplierDepartments, supplierRatingLabels} from "../Utils/constants.util.js"
import { Supplier } from "../Models/suppliers/suppliers.model.js"
import { SupplierRating } from "../Models/suppliers/supplierRating.model.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { uploadOnCloudinary } from "../Utils/claudinary.js"
import { googleAuth } from "../Utils/googleAuth.js"


const addsupplier = async (req,res) =>
{
    try {
        const {id, fullName, password, department} = req.body
    
        const supplierExist = await Supplier.findOne({id})
        
        if(supplierExist) {
            return res.status(409).json({message: "Supplier already Exists", success: false})
        }
        
        const newSupplier = new Supplier({id, fullName,password, department})
        newSupplier.password = await bcrypt.hash(password, 10)
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

// const rateSupplier = async(req,res) => 
// {


//     try {
//         const {id, ratings, monthYear} = req.body

//         const newSupplierRating = await SupplierRating.create(ratings)
        
//         const updateSupplier = await Supplier.findOneAndUpdate(
//             {id},
//             {
//                 $set:{
//                     rating: newSupplierRating._id,
//                     monthYear: monthYear
//                 }
//             },
//             {new: true}
//         ).populate('rating')
    
//         res.status(201).json({message: "Supplier Ratings updated successfully", success: true})
//     } catch (error) {
//         res.status(400).json({message: "Fault in Supplier Rating updation",error, success: false})
//     }

// }

const rateSupplier = async(req,res) => {

    const Shownlabels = [
    "Following Esg Guidelines",
    "Distance of Supplier Plant From Factory in Kilometers(Km)",
    "Delivery Period Efficiency",
    "Quality of Product",
    "Certification of Products",
    "Credit Facility by Supplier",
    "Innovation Ability",
    "Production Capacity",
    "Customer Support Index"
];


    try {
        const spreadsheetId = '1LdspoXQQjtBhoszOzhXb0M1gj1a6z4l8hvKXxZ2N8rE'
        const doc = await googleAuth(spreadsheetId)

        const {id,name, ratings, monthYear, department} = req.body


        if(!id ||!name || !department|| !ratings || !monthYear) {
            res.status(400).json({message: "Fields are missing", success: false})
        }

        const sendData = {ID:id, Name:name, ...ratings, Month:monthYear}
        
        const sheet = doc.sheetsByTitle[department]
        let addedData
        const headers = ["ID","Name", ...Shownlabels ,"Month"]
        
        
        if(sheet){
            const rows = await sheet.getRows()
            if (rows.length !== 0) {
                const lastRow = rows[rows.length -1]
                const lastData = lastRow._rawData.at(-1) || " "
                
                if(lastData !== monthYear)
                    {
                        await sheet.addRow({ID : "_"})
                        await sheet.addRow({ID : "_"})
                    }
            }
                
                addedData = await sheet.addRow(sendData)
                
                // console.log(sheet.headerValues)
            }
            else {
                const newSheet = await doc.addSheet({
                    title: department,
                    headerValues: headers
                })
                
                
                addedData = await newSheet.addRow(sendData)
            }
            
        
        const updateSupplier = await Supplier.findOneAndUpdate(
            {id},
            {
                $set:{
                    monthYear: monthYear
                }
            },
            {new: true}
        )
        
        res.status(201).json({message: "Rating added successfully", success: true })


    } catch (error) {
        res.status(400).json({message: "Fault in Rating updation",success: false, error})
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

const loginSupplier = async (req,res) => {
    try {
        const {id, password} = req.body
        const supplier = await Supplier.findOne({id})
        
        if(!supplier || !id) {
            return res.status(403).json({message: "Invalid email or password",  success: false})
        }
        
        const isPasswordEqual = await bcrypt.compare(password, supplier.password)
        if(!isPasswordEqual) {
            return res.status(403).json({message: "Invalid email or password",  success: false})
        }
        
        
        const jwtToken =  jwt.sign(
            { _id: supplier._id,
                auth: "supplier"
             },
            process.env.JWT_SECRET,
            {expiresIn: '24h'}
        )
        
        return res.status(200).json(
            {
                message: "Login successfull",
                success: true,
                id: id,
                fullName: supplier.fullName,
                department: supplier.department,
                monthYear: supplier.feedbackMonthYear,
                jwtToken,
            }
        )
    } catch (error) {
        res.status(500).json({message: "Internal serverss error", error, success: false})
    }
}

const feedbackSupplier = async (req,res) => {
    const doc = await googleAuth('1zrzoZ28nzet1Ed-fD6p8YjyRasy-JUBpmLb8rgHlcrw')
    try {
        const {id, fullName, suggestion, problem, feedback, department,monthYear} = req.body
        
        if(!id || !fullName || !department || !monthYear)
            {
                res.status(400).json({message: "Required fields are missing", error, success: false})
            }
    
            let photoLocalPath
        if (req.files.photo) {
             photoLocalPath = req?.files?.photo[0]?.path
             console.log(photoLocalPath)
        }
        let uploadedPhoto
        console.log(photoLocalPath)
        
        if(photoLocalPath)
            {
                uploadedPhoto = await uploadOnCloudinary(photoLocalPath)
                if(!uploadedPhoto)
                    {
                        throw new error(400, "Photo is required")
                    }
            }
            
            // console.log(uploadedPhoto.url)
            const sentFeedback ={
                ID: id,
                Name: fullName,
                Department: department,
                Suggestion: suggestion,
                Problem: problem,
                Feedback: feedback,
                Photo: uploadedPhoto?.url || ""
            }
            
            const sheet = doc.sheetsByTitle[monthYear]
            let addedData
            const headers = ["ID","Name", "Department", "Suggestion","Problem","Feedback","Photo"]
            
            if(sheet){
                const rows = await sheet.getRows()
                const lastRow = rows[rows.length -1]
                const lastData = lastRow._rawData.at(-1)

                if(lastData !== monthYear)
                {
                    await sheet.addRow({ID : "_"})
                    await sheet.addRow({ID : "_"})
                }
                addedData = await sheet.addRow(sentFeedback)
                // console.log(sheet.headerValues)
            }
            else {
                const newSheet = await doc.addSheet({
                    title: monthYear,
                    headerValues: headers
                })

                addedData = await newSheet.addRow(sentFeedback)
            }

            if(addedData){
                 const updatesupplier = await Supplier.findOneAndUpdate(
                    {id},
                    {
                        $set:{
                            feedbackMonthYear: monthYear
                        }
                    },
                    {new: true}
                )

                res.status(201).json({message:"Feedback accepted",success:true})
            }
            else{
                res.status(400).json({message: "Something went wrong", success: false})
            }

    } catch (error) {
        res.status(500).json({message: "Internal servers error", error, success: false})
    }
}

export {
    addsupplier,
    checkSupplier,
    deleteSupplier,
    showSupplierRating,
    rateSupplier,
    downloadSupplierRating,
    getSupplierRatingLabels,
    feedbackSupplier,
    loginSupplier
}