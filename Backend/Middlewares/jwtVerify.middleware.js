import jwt from "jsonwebtoken"

const jwtVerify = async(req,res,next) => {
    try {
        const {token} = req.body
        const secret = process.env.JWT_SECRET
        const payload  = jwt.verify(token,secret)

        res.id = payload.id
         
        next()
    } catch (error) {
        res.status(400).json({message: "Invalid token", success: false, error})
    }
}

export {jwtVerify}