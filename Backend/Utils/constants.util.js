import { DealerRating } from "../Models/dealers/dealerRating.model.js"
import { Rating } from "../Models/rating.model.js"
import { SupplierRating } from "../Models/suppliers/supplierRating.model.js"

const departments = ["Deptartment1", "Dept2", "Dept3"]
const dealersDepartments = ["Deal1", "Deal2", "Deal3"]
const supplierDepartments = ["Sup1", "Sup2", "Sup3"]

const ratingLabels = Object.keys(Rating.schema.paths).filter(key=> !["_id", "__v", "createdAt", "updatedAt"].includes(key))
const dealerRatingLabels = Object.keys(DealerRating.schema.paths).filter(key=> !["_id", "__v", "createdAt", "updatedAt"].includes(key))
const supplierRatingLabels = Object.keys(SupplierRating.schema.paths).filter(key=> !["_id", "__v", "createdAt", "updatedAt"].includes(key))

export{
    departments,
    ratingLabels,
    dealersDepartments,
    dealerRatingLabels,
    supplierDepartments,
    supplierRatingLabels

}