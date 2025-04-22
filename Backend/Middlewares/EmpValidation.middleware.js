import joi from "joi"
import { departments } from "../Utils/constants.util.js"

const newEmployeeValidation = (req, res, next) => 
{
    const schema = joi.object({
        id: joi.string().required(),
        fullName: joi.string().required(),
        department: joi.string().required()
    })

    const {error} = schema.validate(req.body)
    if(error){
        return res.status(400).json({message: "Bad request", error})
    }

    next()
}


export {
    newEmployeeValidation
}