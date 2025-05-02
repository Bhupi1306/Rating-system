import { Router } from "express";
// import { addEmployee, checkEmployee, deleteEmployee, rateEmployee, showRating, downloadRating, getRatingLabels } from "../Controllers/employee.controller.js";
import {newObjectValidation} from "../Middlewares/newValidation.middleware.js"
import { dealerRatingsValidation } from "../Middlewares/ratingsValidation.middleware.js";
import { addDealer, checkDealer, deleteDealer, downloadDealerRating, getDealerRatingLabels, rateDealer, showDealerRating } from "../Controllers/dealer.controller.js";


const router = Router()


router.post('/add', newObjectValidation, addDealer)
router.post('/check', checkDealer)
router.post('/delete', deleteDealer)
router.post('/rate', showDealerRating)
router.post('/rate/submit',dealerRatingsValidation, rateDealer)
router.post('/download/rating', downloadDealerRating)
router.get('/label/rating', getDealerRatingLabels)

export default router