import { Router } from "express";
import {newObjectValidation} from "../Middlewares/newValidation.middleware.js"
import { supplierRatingsValidation } from "../Middlewares/ratingsValidation.middleware.js";
import { addsupplier, checkSupplier, deleteSupplier, downloadSupplierRating, getSupplierRatingLabels, rateSupplier, showSupplierRating } from "../Controllers/supplier.controller.js";


const router = Router()


router.post('/add', newObjectValidation, addsupplier)
router.post('/check', checkSupplier)
router.post('/delete', deleteSupplier)
router.post('/rate', showSupplierRating)
router.post('/rate/submit',supplierRatingsValidation, rateSupplier)
router.post('/download/rating', downloadSupplierRating)
router.get('/label/rating', getSupplierRatingLabels)

export default router