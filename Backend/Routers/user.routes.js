import { Router } from "express";
import { registerUser, loginUser } from "../Controllers/user.controller.js";
import { loginValidation, signUpValidation } from "../Middlewares/AuthValidation.middleware.js";
import { jwtVerify } from "../Utils/jwtVerify.js";


const router = Router()

// router.route('/register').post(registerUser)

// router.route('/login').post(loginUser)

router.post('/register', signUpValidation, registerUser)
router.post('/login', loginValidation, loginUser)
router.post('/verify', jwtVerify)


export default router