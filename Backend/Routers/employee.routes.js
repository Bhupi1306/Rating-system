import { Router } from "express";
import { addEmployee, checkEmployee, deleteEmployee, rateEmployee, showRating, downloadRating, getRatingLabels } from "../Controllers/employee.controller.js";
import {newObjectValidation} from "../Middlewares/newValidation.middleware.js"
import { ratingsValidation } from "../Middlewares/ratingsValidation.middleware.js";


const router = Router()


router.post('/add', newObjectValidation, addEmployee)
router.post('/check', checkEmployee)
router.post('/delete', deleteEmployee)
router.post('/rate', showRating)
router.post('/rate/submit',ratingsValidation, rateEmployee)
router.post('/download/rating', downloadRating)
router.get('/label/rating', getRatingLabels)

export default router