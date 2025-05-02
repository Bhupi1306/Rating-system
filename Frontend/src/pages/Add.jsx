import React from "react";
import AddObject from "../components/AddObject";


const AddEmployee = () => {
    return AddObject("http://localhost:8000/employee/label/rating","http://localhost:8000/employee/add", "Employee")
}

const  AddDealer = () => {
    return AddObject("http://localhost:8000/dealer/label/rating","http://localhost:8000/dealer/add", "Dealer" )
}

const AddSupplier = () => {
    return AddObject("http://localhost:8000/supplier/label/rating","http://localhost:8000/supplier/add", "Supplier" )
}


export{
    AddDealer,
    AddEmployee,
    AddSupplier
}