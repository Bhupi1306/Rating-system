import { dealerRatingLabels, ratingLabels, supplierRatingLabels } from "../Utils/constants.util.js";


const ratingsValidation = (req,res,next) => 
    {
        const labels = ratingLabels

          const curMonth = new Date().toLocaleString("default",{month: "long"})
          const year = new Date().getFullYear()
          const curMonthYear = curMonth + year
    
    
          
          try {
              const {id, ratings, monthYear} = req.body
              //Checks if every rating is present and valid
              const allRatingsValid = labels.every(key => key in ratings && ratings[key]>=0 && ratings[key]<=5)
            if(allRatingsValid && curMonthYear == monthYear)
            {
                next()
            }else{
                return res.status(400).json({message: "Invalid raitings or date", success: false})
            }
        } catch (error) {
            res.status(401).json({message: "Authentication Error",error ,success: false})
        }
    
    
    }

const dealerRatingsValidation = (req,res,next) => 
    {
        const labels = dealerRatingLabels

            const curMonth = new Date().toLocaleString("default",{month: "long"})
            const year = new Date().getFullYear()
            const curMonthYear = curMonth + year
    
    
            
            try {
                const {id, ratings, monthYear} = req.body
                //Checks if every rating is present and valid
                const allRatingsValid = labels.every((key, index) => {
                if(index == 0){
                    return true
                }
                else{
                 return key in ratings && ratings[key]>=0 && ratings[key]<=5
            }})
            if(allRatingsValid && curMonthYear == monthYear)
            {
                next()
            }else{
                return res.status(400).json({message: "Invalid raitings or date", success: false})
            }
        } catch (error) {
            res.status(401).json({message: "Authentication Error",error ,success: false})
        }
    
    
    }



const supplierRatingsValidation = (req,res,next) => 
    {
        const labels = supplierRatingLabels

            const curMonth = new Date().toLocaleString("default",{month: "long"})
            const year = new Date().getFullYear()
            const curMonthYear = curMonth + year
    
    
            
            try {
                const {id, ratings, monthYear} = req.body
                //Checks if every rating is present and valid
                const allRatingsValid = labels.every((key, index) => {
                if(["followingEsgStandards", "distance","certificationOfProducts", "creditFacilityBySupplier"].includes(key)){
                    return true
                }
                else{
                 return key in ratings && ratings[key]>=0 && ratings[key]<=5
            }})
            if(allRatingsValid && curMonthYear == monthYear)
            {
                next()
            }else{
                return res.status(400).json({message: "Invalid ratings or date", success: false})
            }
        } catch (error) {
            res.status(401).json({message: "Authentication Error",error ,success: false})
        }
    
    
    }





    export {
        ratingsValidation,
        dealerRatingsValidation,
        supplierRatingsValidation
    }