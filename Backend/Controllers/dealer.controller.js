import { Dealer } from "../Models/dealers/dealer.model.js"
import {json2csv} from "json-2-csv"
import {dealersDepartments, dealerRatingLabels} from "../Utils/constants.util.js"
import { DealerRating } from "../Models/dealers/dealerRating.model.js"


const addDealer = async (req,res) =>
{
    try {
        const {id, fullName, department} = req.body
    
        const dealerExist = await Dealer.findOne({id})
        
        if(dealerExist) {
            return res.status(409).json({message: "Dealer already Exists", success: false})
        }
        
        const newDealer = new Dealer({id, fullName, department})
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

const rateDealer = async(req,res) => 
{


    try {
        const {id, ratings, monthYear} = req.body
        const newDealerRating = await DealerRating.create(ratings)
        
        const updateDealer = await Dealer.findOneAndUpdate(
            {id},
            {
                $set:{
                    rating: newDealerRating._id,
                    monthYear: monthYear
                }
            },
            {new: true}
        ).populate('rating')


    
        res.status(201).json({message: "Dealer Ratings updated successfully", success: true})
    } catch (error) {
        res.status(400).json({message: "Fault in Dealer Rating updation",error, success: false})
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

export {
    addDealer,
    checkDealer,
    deleteDealer,
    showDealerRating,
    rateDealer,
    downloadDealerRating,
    getDealerRatingLabels
}