import { Router } from "express";
import { addEmployee, checkEmployee, deleteEmployee } from "../Controllers/employee.controller.js";
import {newEmployeeValidation} from "../Middlewares/EmpValidation.middleware.js"


const router = Router()


router.post('/add', newEmployeeValidation, addEmployee)
router.post('/check', checkEmployee)
router.post('/delete', deleteEmployee)

export default router