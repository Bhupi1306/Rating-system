import jwt from "jsonwebtoken"

const jwtVerify = async(req,res) => {
    try {
        const {token} = req.body
        const secret = process.env.JWT_SECRET
        const verification = jwt.verify(token,secret)


        res.status(200).json({success: true, auth: verification.auth})

         
    } catch (error) {
        res.status(400).json({message: "Invalid token", success: false, error})
    }
}

export {jwtVerify}