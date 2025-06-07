import { Dealer } from "../Models/dealers/dealer.model.js"
import {json2csv} from "json-2-csv"
import {dealersDepartments, dealerRatingLabels} from "../Utils/constants.util.js"
import { DealerRating } from "../Models/dealers/dealerRating.model.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { uploadOnCloudinary } from "../Utils/claudinary.js"
import { googleAuth } from "../Utils/googleAuth.js"


const addDealer = async (req,res) =>
{
    try {
        const {id, fullName,password, department} = req.body
    
        const dealerExist = await Dealer.findOne({id})
        
        if(dealerExist) {
            return res.status(409).json({message: "Dealer already Exists", success: false})
        }
        
        const newDealer = new Dealer({id, fullName,password, department})
        newDealer.password = await bcrypt.hash(password, 10)
        await newDealer.save()

        return res.status(201).json({message: "Dealer Added succesfully", success: true})
    
    } catch (error) {
        res.status(405).json({message: "Something went wrong", success: false, error: error})
    }
}

const checkDealer = async (req,res) => {
    try {
        const {id} = req.body
        if(!id) {
            return res.status(409).json({message: "Invalid Id", success: false})
        }
    
        const dealer = await Dealer.findOne({id})
    
        if(!dealer)
        {
            return res.status(409).json({message: "Dealer does not exist", success: false})
        }

        res.status(201).json({
            message: "Dealer exists",
            id: dealer.id,
            fullName: dealer.fullName,
            department: dealer.department,
            success: true
        })


    } catch (error) {
        res.status(405).json({message: "Something went wrong checking if Dealer exists", success: false, error: error})
    }
}

const deleteDealer = async (req,res) => 
{
    try {
        const {id} = req.body
        if(!id) {
            return res.status(409).json({message: "Invalid Id", success: false})
        }
    
        await Dealer.findOneAndDelete({id})

        const checkDealer = await Dealer.findOne({id})

        if(checkDealer)
        {
            return res.status(409).json({message: "Something went wrong in deleting Dealer", success: false})
        }
    


        res.status(201).json({
            message: "Dealer deleted",
            success: true
        })


    } catch (error) {
        res.status(405).json({message: "Something went wrong while deleting a Dealer", success: false, error: error})
    }
}

const showDealerRating = async(req,res) => 
{
    const curMonth = new Date().toLocaleString("default",{month: "long"})
    const year = new Date().getFullYear()
    const monthYear = curMonth + year
    const dept = dealersDepartments 

    try {
        const {department} = req.body
        const checkDept = dept.includes(department)
        
        if(!checkDept)
        {
            return res.status(400).json({message: "invalid Department", success: false})
        }

        const dealer = await Dealer.find({
            $and: [
                {department: department},
                {monthYear:{$ne: monthYear}}
            ]
        }).select('-rating')

        if(!dealer) 
        {
            return res.status(400).json({message: "No Dealer found", success: false})
        }
        res.status(200).json(
            {
                message: "Dealer found",
                dealer,
                success: true
            }
        )


        

        
    } catch (error) {
        res.status(400).json({message: "Something went wrong", error})
    }
}

// const rateDealer = async(req,res) => 
// {


//     try {
//         const {id, ratings, monthYear} = req.body
//         const newDealerRating = await DealerRating.create(ratings)
        
//         const updateDealer = await Dealer.findOneAndUpdate(
//             {id},
//             {
//                 $set:{
//                     rating: newDealerRating._id,
//                     monthYear: monthYear
//                 }
//             },
//             {new: true}
//         ).populate('rating')


    
//         res.status(201).json({message: "Dealer Ratings updated successfully", success: true})
//     } catch (error) {
//         res.status(400).json({message: "Fault in Dealer Rating updation",error, success: false})
//     }

// }

const rateDealer = async(req,res) => {

    const Shownlabels = [
    "Sales Turnover",
    "Service Time",
    "Customer Relations Index",
    "insuranceSettlement",
    "Finance Facilities",
    "Staff Training",
    "Staff Behaviour",
    "Following Esg Guidelines"
];

    try {
            const spreadsheetId = '1GWQD7JfxGNPVAhzmUzH7N0Ec2u-jmZoZFFX0N3EKbUY'
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

            const updateDealer = await Dealer.findOneAndUpdate(
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

const downloadDealerRating = async (req,res) => 
    {
        const {selectedDepartment} = req.body
        const curMonth = new Date().toLocaleString("default",{month: "long"})
        const year = new Date().getFullYear()

        const labels = dealerRatingLabels

        if(!selectedDepartment)
        {
            res.status(402).json({message: "Department is required", success: false})
        }

        try {
            const dealers = await Dealer.find({department: selectedDepartment}).populate('rating').lean()
            const data = dealers.map(dealer => 
            {
                const row = {
                    Id: dealer.id,
                    Name: dealer.fullName,
                }

                
                labels.forEach(label => {
                    if(dealer.rating[label] === 0 || dealer.rating[label] === "0"){
                        row[label] = "N/A"
                    }
                    else{
                    row[label] = dealer.rating?.[label] || "N/A"
                }
                })
                return row
            }
            )
            const csv = `Month,${curMonth} ${year}\n` + json2csv(data);
            res.header("Content-type", 'text/csv')
            res.attachment(`${selectedDepartment}_dealer_rating.csv`)
            res.send(csv)

        } catch (error) {
            res.status(400).json({message: "Something went wrong", success: false, error })
        }
        
    }

const getDealerRatingLabels = (req,res) =>{
    res.json({dealerRatingLabels, shownDepartments:dealersDepartments})
}

const loginDealer = async (req,res) => {
    try {
        const {id, password} = req.body
        const dealer = await Dealer.findOne({id})
        
        if(!dealer || !id) {
            return res.status(403).json({message: "Invalid email or password",  success: false})
        }
        
        const isPasswordEqual = await bcrypt.compare(password, dealer.password)
        if(!isPasswordEqual) {
            return res.status(403).json({message: "Invalid email or password",  success: false})
        }
        
        
        const jwtToken =  jwt.sign(
            { _id: dealer._id,
                auth: "dealer"
             },
            process.env.JWT_SECRET,
            {expiresIn: '24h'}
        )
        
        return res.status(200).json(
            {
                message: "Login successfull",
                success: true,
                id: id,
                fullName: dealer.fullName,
                department: dealer.department,
                monthYear: dealer.feedbackMonthYear,
                jwtToken,
            }
        )
    } catch (error) {
        res.status(500).json({message: "Internal serverss error", error, success: false})
    }
}

const feedbackDealer = async (req,res) => {
    const doc = await googleAuth('1LMvhIAGiK0CmWpEmfppRC35CCFZhdP-a3RS4DuRqPSQ')
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
                 const updateDealer = await Dealer.findOneAndUpdate(
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
    addDealer,
    checkDealer,
    deleteDealer,
    showDealerRating,
    rateDealer,
    downloadDealerRating,
    getDealerRatingLabels,
    loginDealer,
    feedbackDealer
}