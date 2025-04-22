import {Employee} from "../Models/employee.model.js"

const addEmployee = async (req,res) =>
{
    try {
        const {id, fullName, department} = req.body
    
        const employeeExist = await Employee.findOne({id})
        
    
        console.log(employeeExist)
        
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

export {
    addEmployee,
    checkEmployee,
    deleteEmployee
}