import { Router } from "express";
import {newObjectValidation} from "../Middlewares/newValidation.middleware.js"
import { supplierRatingsValidation } from "../Middlewares/ratingsValidation.middleware.js";
import {upload} from "../Middlewares/multer.middleware.js"
import { addsupplier, checkSupplier, deleteSupplier, downloadSupplierRating, feedbackSupplier, getSupplierRatingLabels, loginSupplier, rateSupplier, showSupplierRating } from "../Controllers/supplier.controller.js";


const router = Router()



router.post('/feedback/login', loginSupplier)

router.route('/feedback/form').post(
    upload.fields([
        {
            name: "photo",
            maxCount: 1
        }
    ]), feedbackSupplier
)
router.post('/add', newObjectValidation, addsupplier)
router.post('/check', checkSupplier)
router.post('/delete', deleteSupplier)
router.post('/rate', showSupplierRating)
router.post('/rate/submit',supplierRatingsValidation, rateSupplier)
router.post('/download/rating', downloadSupplierRating)
router.get('/label/rating', getSupplierRatingLabels)

export default router