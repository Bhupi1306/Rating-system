import {User} from "../Models/user.model.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const registerUser = async (req,res) => {
    try {
        const {fullName, email, password} = req.body
        const userPresent = await User.findOne({email})

        if(userPresent) {
            return res.status(409).json({message: "User already present",  success: false})
        }


        const newUser = new User({fullName, email, password})
        newUser.password = await bcrypt.hash(password, 10)
        await newUser.save()

        return res.status(201).json({message: "signup successfull", success: true})
    } catch (error) {
        res.status(500).json({message: "Internal server error", success: false})
    }
}

const loginUser = async (req,res) => {
    try {
        const {email, password} = req.body
        const user = await User.findOne({email})

        if(!user) {
            return res.status(403).json({message: "Invalid email or password",  success: false})
        }

        const isPasswordEqual = await bcrypt.compare(password, user.password)
        if(!isPasswordEqual) {
            return res.status(403).json({message: "Invalid email or password",  success: false})
        }

        const jwtToken =  jwt.sign(
            { email: user.email, _id: user._id },
            process.env.JWT_SECRET,
            {expiresIn: '24h'}
        )


        return res.status(200).json(
            {
                message: "Login successfull",
                success: true,
                jwtToken,
                email,
                name: user.fullName,
                isAdmin: user.isAdmin
            }
        )
    } catch (error) {
        res.status(500).json({message: "Internal server error", success: false})
    }
}

export {
    registerUser,
    loginUser
}