import { Router } from "express";
import { registerUser, loginUser } from "../Controllers/user.controller.js";
import { signUpValidation } from "../Middlewares/AuthValidation.middleware.js";


const router = Router()

// router.route('/register').post(registerUser)

// router.route('/login').post(loginUser)

router.post('/register', signUpValidation, registerUser)

export default router