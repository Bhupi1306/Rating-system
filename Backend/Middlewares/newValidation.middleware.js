import joi from "joi"

const newObjectValidation = (req, res, next) => 
{
    const schema = joi.object({
        id: joi.string().required(),
        fullName: joi.string().required(),
        password: joi.string(),
        department: joi.string().required()
    })

    const {error} = schema.validate(req.body)
    if(error){
        return res.status(400).json({message: "Bad request", error})
    }

    next()
}


export {
    newObjectValidation
}