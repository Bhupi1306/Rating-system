const ratingsValidation = (req,res,next) => 
    {
        const labels = [
            "productivity",
            "worksEthics",
            "professionalism",
            "learningAbility",
            "leadership",
            "teamWork",
            "attendance",
            "confidence",
            "teamBuilding",
            "growthOriented",
            "technicalKnowledge",
            "CPGC",
            "employeeWellBeing",
            "employeeHealth"
          ];

          const curMonth = new Date().toLocaleString("default",{month: "long"})
          const year = new Date().getFullYear()
          const curMonthYear = curMonth + year
    
    
          
          try {
              const {id, ratings, monthYear} = req.body
              //Checks if every rating is present and valid
              const allRatingsValid = labels.every(key => key in ratings && ratings[key]>=1 && ratings[key]<=5)
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

    export {ratingsValidation}