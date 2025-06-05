import joi from "joi"

const signUpValidation = (req, res, next) => 
{
    const schema = joi.object({
        fullName: joi.string().required(),
        email: joi.string().email().required(),
        password: joi.string().min(4),
        webAccess: joi.string().required()
    })

    const {error} = schema.validate(req.body)
    if(error){
        return res.status(400).json({message: "Bad request", error})
    }

    next()
}

const loginValidation = (req, res, next) => 
    {
        const schema = joi.object({
            email: joi.string().email().required(),
            password: joi.string().min(4)
        })
    
        const {error} = schema.validate(req.body)
        if(error){
            return res.status(400).json({message: "Bad request", error})
        }
    
        next()
}

const employeeLoginValidation = (req, res, next) => 
    {
        const schema = joi.object({
            id: joi.string().required(),
            password: joi.string().min(4).required()
        })
    
        const {error} = schema.validate(req.body)
        if(error){
            return res.status(400).json({message: "Bad request", error})
        }
    
        next()
}

export {
    signUpValidation,
    loginValidation,
    employeeLoginValidation,
}