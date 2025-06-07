import { Router } from "express";
import { addEmployee, checkEmployee, deleteEmployee, rateEmployee, showRating, downloadRating, getRatingLabels, loginEmployee, feedbackEmployee } from "../Controllers/employee.controller.js";
import {newObjectValidation} from "../Middlewares/newValidation.middleware.js"
import { ratingsValidation } from "../Middlewares/ratingsValidation.middleware.js";
import {upload} from "../Middlewares/multer.middleware.js"
import { jwtVerify } from "../Utils/jwtVerify.js";


const router = Router()


router.post('/feedback/login', loginEmployee)
// router.post('/feedback/form', loginEmployee)
router.route('/feedback/form').post(
    upload.fields([
        {
            name: "photo",
            maxCount: 1
        }
    ]), feedbackEmployee
)
router.post('/add', newObjectValidation, addEmployee)
router.post('/check', checkEmployee)
router.post('/delete', deleteEmployee)
router.post('/rate', showRating)
router.post('/rate/submit', rateEmployee)
router.post('/download/rating', downloadRating)
router.get('/label/rating', getRatingLabels)
router.post('/verify', jwtVerify)

export default router