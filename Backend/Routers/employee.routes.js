import { Router } from "express";
import { addEmployee, checkEmployee, deleteEmployee, rateEmployee, showRating } from "../Controllers/employee.controller.js";
import {newEmployeeValidation} from "../Middlewares/EmpValidation.middleware.js"
import { ratingsValidation } from "../Middlewares/ratingsValidation.middleware.js";


const router = Router()


router.post('/add', newEmployeeValidation, addEmployee)
router.post('/check', checkEmployee)
router.post('/delete', deleteEmployee)
router.post('/rate', showRating)
router.post('/rate/submit',ratingsValidation, rateEmployee)

export default router