import {Head} from "../Models/head.model.js"

const registerUser = async (req,res) => {
    try {
        const {fullName, email, password} = req.body
        const user = await Head.findOne({email})

        if(user) {
            return res.status(409).json({message: "User already present",  success: false})
        }


        const head = new Head({fullName, email, password})


        return res.status(100).json({message: "registerUser function is in development"})
    } catch (error) {
        res.status(500).json({message: "Internal server error"})
    }
}

const loginUser = async (req,res) => {
    try {
        return res.status(100).json({message: "Login function is in development"})
    } catch (error) {
        res.status(500).json({message: "Internal server error"})
    }
}

export {
    registerUser,
    loginUser
}