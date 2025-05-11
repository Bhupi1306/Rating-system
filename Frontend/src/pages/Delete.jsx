import React from "react";
import DeleteObject from "../components/DeleteObject";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;


const DeleteEmployee = () => {
    return DeleteObject(`${API_BASE_URL}employee/check`,`${API_BASE_URL}employee/delete`, `Employee`)
}


const DeleteDealer = () => {
    return DeleteObject(`${API_BASE_URL}dealer/check`,`${API_BASE_URL}dealer/delete`, `Dealer`)
}


const DeleteSupplier = () => {
    return DeleteObject(`${API_BASE_URL}supplier/check`,`${API_BASE_URL}supplier/delete`, `Supplier`)
}


export {
    DeleteDealer,
    DeleteEmployee,
    DeleteSupplier
}