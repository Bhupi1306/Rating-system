import joi from "joi"

const signUpValidation = (req, res, next) => 
{
    const schema = joi.object({
        fullName: joi.string().required(),
        email: joi.string().email().required(),
        password: joi.string().min(4)
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

export {
    signUpValidation,
    loginValidation
}