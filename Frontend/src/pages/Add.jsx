import React from "react";
import AddObject from "../components/AddObject";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;


const AddEmployee = () => {
    return AddObject(`${API_BASE_URL}employee/label/rating`,`${API_BASE_URL}employee/add`, `Employee`)
}

const  AddDealer = () => {
    return AddObject(`${API_BASE_URL}dealer/label/rating`,`${API_BASE_URL}dealer/add`, `Dealer` )
}

const AddSupplier = () => {
    return AddObject(`${API_BASE_URL}supplier/label/rating`,`${API_BASE_URL}supplier/add`, `Supplier` )
}


export{
    AddDealer,
    AddEmployee,
    AddSupplier
}