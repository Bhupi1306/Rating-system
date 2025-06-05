import React from "react";
import AddObject from "../components/AddObject";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;


const AddEmployee = () => {
    return AddObject(`${API_BASE_URL}employee/label/rating`,`${API_BASE_URL}employee/add`, `Employee`, true)
    // return AddObject(`${API_BASE_URL}employee/label/rating`,`http://localhost:8000/employee/add`, `Employee`)
}

const  AddDealer = () => {
    return AddObject(`${API_BASE_URL}dealer/label/rating`,`${API_BASE_URL}dealer/add`, `Dealer`, true )
}

const AddSupplier = () => {
    return AddObject(`${API_BASE_URL}supplier/label/rating`,`${API_BASE_URL}supplier/add`, `Supplier`, true)
}


export{
    AddDealer,
    AddEmployee,
    AddSupplier
}