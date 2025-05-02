import {Employee} from "../Models/employee.model.js"
import { Rating } from "../Models/rating.model.js"
import {json2csv} from "json-2-csv"
import {ratingLabels, departments} from "../Utils/constants.util.js"

const addEmployee = async (req,res) =>
{
    try {
        const {id, fullName, department} = req.body
    
        const employeeExist = await Employee.findOne({id})
        
    
        
        if(employeeExist) {
            return res.status(409).json({message: "Employee already Exists", success: false})
        }
        
        const newEmployee = new Employee({id, fullName, department})
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

const rateEmployee = async(req,res) => 
{


    try {
        const {id, ratings, monthYear} = req.body

        const newRating = await Rating.create(ratings)
        
        const updateEmployee = await Employee.findOneAndUpdate(
            {id},
            {
                $set:{
                    rating: newRating._id,
                    monthYear: monthYear
                }
            },
            {new: true}
        ).populate('rating')
    
        res.status(201).json({message: "Ratings updated successfully", success: true})
    } catch (error) {
        res.status(400).json({message: "Fault in Rating updation",success: false})
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
export {
    addEmployee,
    checkEmployee,
    deleteEmployee,
    showRating,
    rateEmployee,
    downloadRating,
    getRatingLabels
}