import React from "react";
import DeleteObject from "../components/DeleteObject";


const DeleteEmployee = () => {
    return DeleteObject("http://localhost:8000/employee/check","http://localhost:8000/employee/delete", "Employee")
}


const DeleteDealer = () => {
    return DeleteObject("http://localhost:8000/dealer/check","http://localhost:8000/dealer/delete", "Dealer")
}


const DeleteSupplier = () => {
    return DeleteObject("http://localhost:8000/supplier/check","http://localhost:8000/supplier/delete", "Supplier")
}


export {
    DeleteDealer,
    DeleteEmployee,
    DeleteSupplier
}