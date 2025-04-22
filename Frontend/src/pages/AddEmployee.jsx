import React, { useState } from "react";
import logo from "../assets/Logo.jpg"
import {ToastContainer} from "react-toastify"
import { handleError, handleSuccess } from "../utils";
import { Link, useNavigate } from "react-router-dom";

const AddUser = () => {
  const [info, setInfo] = useState({
    id: "",
    fullName: ""
  })
  const [deptDropdown, setDeptDropdown] = useState('Department')


  const deptNames = ["Dept1", "Dept2", "Dept3"]



  
  const handleChange = (e) => {
    const{name,value} = e.target
    const infoCopy = {...info}
    infoCopy[name] = value
    setInfo(infoCopy)
  }

  const handleDropdown = (e) => {
    setDeptDropdown(e.target.value)
  }

  const handleAdd = async (e) => {
    e.preventDefault()

    const {id, fullName} = info
    const department = deptDropdown

    const emp_info = {...info, department: department} 


    if(!id || !fullName || !department || !deptNames.includes(department)){
      return handleError("All fields are required")
    }


    try {
      const url = "http://localhost:8000/employee/add"
      const response = await fetch(url, {
        method: "POST",
        headers: {
          'content-type':'application/json'
        },
        body: JSON.stringify(emp_info)
      })

      const result = await response.json()

      const {success, message, error} = result
      const empty = {id:"", fullName: ""}

      if(success)
      {
        handleSuccess(message)
        setInfo(empty)
        setDeptDropdown("Department")
      }
      else if(!success)
      {
        handleError(message)
      }
      else if(error)
      {
        const details = error?.details[0].message;
        handleError(details)
      }


    } catch (error) {
      handleError(error)
    }



  }






    return (
            <>

              
              <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8 ">
                <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                  <h2 className="mt-3 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
                    New Employee
                  </h2>
                </div>
        
                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                  <form onSubmit={handleAdd}  className="space-y-6">
    
                    <div>
                      <label htmlFor="id" className="block text-sm/6 font-medium text-gray-900">
                        Employee ID
                      </label>
                      <div className="mt-2">
                        <input
                          onChange={handleChange}
                          value={info.id}
                          id="id"
                          name="id"
                          type="text"
                          required
                          className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                        />
                      </div>
                    </div>



                    <div>
                      <label htmlFor="id" className="block text-sm/6 font-medium text-gray-900">
                        Full Name
                      </label>
                      <div className="mt-2">
                        <input
                          onChange={handleChange}
                          value={info.fullName}
                          id="fullName"
                          name="fullName"
                          type="text"
                          required
                          className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                        />
                      </div>
                    </div>
        
                    <div>
                      <select 
                      value = {deptDropdown}
                      className="px-6 py-2 border border-gray-300 rounded-md" name="Department" id="Department" onChange={handleDropdown}>
                        <option disabled >Department</option>
                        {deptNames.map((item,index) => {
                          return <option value={item} key={index}>{item}</option>
                        })}
                      </select>
                    </div>
        
                    <div>
                      <button
                        type="submit"
                        className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                      >
                        Add Employee
                      </button>
                    </div>
                  </form>
                  <ToastContainer /> 
                </div>
              </div>
            </>
          )
}

export default AddUser