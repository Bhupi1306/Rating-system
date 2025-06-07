import {Employee} from "../Models/employee.model.js"
import { Rating } from "../Models/rating.model.js"
import {json2csv} from "json-2-csv"
import bcrypt from "bcrypt"
import {ratingLabels, departments} from "../Utils/constants.util.js"
import jwt from "jsonwebtoken"
import { uploadOnCloudinary } from "../Utils/claudinary.js"
import { googleAuth } from "../Utils/googleAuth.js"
import { jwtVerify } from "../Utils/jwtVerify.js"

const addEmployee = async (req,res) =>
{
    try {
        const {id, fullName, password, department} = req.body
    
        const employeeExist = await Employee.findOne({id})
        
    
        
        if(employeeExist) {
            return res.status(409).json({message: "Employee already Exists", success: false})
        }
        
        const newEmployee = new Employee({id, fullName, password, department})
        newEmployee.password = await bcrypt.hash(password, 10)
        await newEmployee.save()

        
    
        return res.status(201).json({message: "Employee Added succesfully", success: true})

    
    } catch (error) {
        res.status(405).json({message: "Something went wrong", success: false, error: error})
    }
}

const checkEmployee = async (req,res) => {
    try {
        const {id} = req.body
        if(!id) {
            return res.status(409).json({message: "Invalid Id", success: false})
        }
    
        const employee = await Employee.findOne({id})
    
        if(!employee)
        {
            return res.status(409).json({message: "Employee does not exist", success: false})
        }

        res.status(201).json({
            message: "Employee exists",
            id: employee.id,
            fullName: employee.fullName,
            department: employee.department,
            success: true
        })


    } catch (error) {
        res.status(405).json({message: "Something went wrong checking if employee exists", success: false, error: error})
    }
}


const deleteEmployee = async (req,res) => 
{
    try {
        const {id} = req.body
        if(!id) {
            return res.status(409).json({message: "Invalid Id", success: false})
        }
    
        await Employee.findOneAndDelete({id})

        const checkEmp = await Employee.findOne({id})

        if(checkEmp)
        {
            return res.status(409).json({message: "Something went wrong in deleting emp", success: false})
        }
    


        res.status(201).json({
            message: "Employee deleted",
            success: true
        })


    } catch (error) {
        res.status(405).json({message: "Something went wrong while deleting an employee", success: false, error: error})
    }
}

const showRating = async(req,res) => 
{
const curMonth = new Date().toLocaleString("default",{month: "long"})
    const year = new Date().getFullYear()
    const monthYear = curMonth + year
    const dept = departments 

    try {
        const {department} = req.body
        const checkDept = dept.includes(department)
        
        if(!checkDept)
        {
            return res.status(400).json({message: "invalid Department", success: false})
        }

        const employee = await Employee.find({
            $and: [
                {department: department},
                {monthYear:{$ne: monthYear}}
            ]
        }).select('-rating')

        console.log(employee)
        if(!employee) 
        {
            return res.status(400).json({message: "No employee found", success: false})
        }
        res.status(200).json(
            {
                message: "Employee found",
                employee,
                success: true
            }
        )


        

        
    } catch (error) {
        res.status(400).json({message: "Something went wrong"})
    }
}

// const rateEmployee = async(req,res) => 
// {


//     try {
//         const {id, ratings, monthYear} = req.body

//         const newRating = await Rating.create(ratings)
        
//         const updateEmployee = await Employee.findOneAndUpdate(
//             {id},
//             {
//                 $set:{
//                     monthYear: monthYear
//                 }
//             },
//             {new: true}
//         ).populate('rating')
    
//         res.status(201).json({message: "Ratings updated successfully", success: true})
//     } catch (error) {
//         res.status(400).json({message: "Fault in Rating updation",success: false})
//     }

// }
const rateEmployee = async(req,res) => 
{   
    const Shownlabels = [
  "Productivity",
  "Works Ethics",
  "Professionalism",
  "Learning Ability",
  "Leadership",
  "Team Work",
  "Regularity/Attendance",
  "Confidence",
  "Team Building",
  "Growth Oriented",
  "Technical Knowledge",
  "Company-Personal Goals Compatibility",
  "Employees Well Being",
  "Employee Health"
];


    try {
        const spreadsheetId = '1QjvO9Yf8OJX3LAiTqjCfhfGHIbf59vKcDDYL-gcvOtY'
        const doc = await googleAuth(spreadsheetId)

        const {id,name, ratings, monthYear, department} = req.body


        if(!id || !name || !department|| !ratings || !monthYear) {
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
            
            const updateEmployee = await Employee.findOneAndUpdate(
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

const downloadRating = async (req,res) => 
    {
        const {selectedDepartment} = req.body
        const curMonth = new Date().toLocaleString("default",{month: "long"})
        const year = new Date().getFullYear()

        const labels = ratingLabels

        if(!selectedDepartment)
        {
            res.status(402).json({message: "Department is required", success: false})
        }

        try {
            const employees = await Employee.find({department: selectedDepartment}).populate('rating').lean()
            const data = employees.map(emp => 
            {
                const row = {
                    Id: emp.id,
                    Name: emp.fullName,
                }

                
                labels.forEach(label => {
                    if(emp.rating[label] === 0 || emp.rating[label] === "0"){
                        row[label] = "N/A"
                    }
                    else{
                    row[label] = emp.rating?.[label] || "N/A"
                }
                })
                return row
            }
            )
            const csv = `# Month  ${curMonth} ${year}\n` + json2csv(data);
            res.header("Content-type", 'text/csv')
            res.attachment(`${selectedDepartment}_rating.csv`)
            res.send(csv)

        } catch (error) {
            res.status(400).json({message: "Something went wrong", success: false, error })
        }
        
    }


const getRatingLabels = (req,res) =>{
    res.json({ratingLabels, shownDepartments:departments})
}

const loginEmployee = async (req,res) => {
    try {
        const {id, password} = req.body
        const employee = await Employee.findOne({id})
        
        if(!employee || !id) {
            return res.status(403).json({message: "Invalid email or password",  success: false})
        }
        
        const isPasswordEqual = await bcrypt.compare(password, employee.password)
        if(!isPasswordEqual) {
            return res.status(403).json({message: "Invalid email or password",  success: false})
        }
        
        
        const jwtToken =  jwt.sign(
            { _id: employee._id,
                auth: "Employee"
             },
            process.env.JWT_SECRET,
            {expiresIn: '24h'}
        )
        
        return res.status(200).json(
            {
                message: "Login successfull",
                success: true,
                id: id,
                fullName: employee.fullName,
                department: employee.department,
                monthYear: employee.feedbackMonthYear,
                jwtToken,
            }
        )
    } catch (error) {
        res.status(500).json({message: "Internal serverss error", error, success: false})
    }
}

const feedbackEmployee = async (req,res) => {
    try {
        const spreadsheetId = '1u4IkNtv_bNd6lJYBPWLBeYlFD5ufmjd-exdiXS1R-kA'
        const doc = await googleAuth(spreadsheetId)
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
                Photo: uploadedPhoto?.url || "",
                Month: monthYear
            }
            
            const sheet = doc.sheetsByTitle[department]
            let addedData
            const headers = ["ID","Name", "Department", "Suggestion","Problem","Feedback","Photo","Month"]

            
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
                    title: department,
                    headerValues: headers
                })


                addedData = await newSheet.addRow(sentFeedback)
            }

            if(addedData){
                 const updateEmployee = await Employee.findOneAndUpdate(
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
    addEmployee,
    checkEmployee,
    deleteEmployee,
    showRating,
    rateEmployee,
    downloadRating,
    getRatingLabels,
    loginEmployee,
    feedbackEmployee
}