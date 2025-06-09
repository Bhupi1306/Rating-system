import { useState, useEffect } from "react";
import logo from "../assets/Logo.jpg"
import {ToastContainer} from "react-toastify"
import { handleError, handleSuccess } from "../utils";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const EmployeeLogin = () => {

  const field = ["Employee", "Dealer", "Supplier"]
  const [webAccess, setwebAccess] = useState('Access')

  const navigate = useNavigate()
  const [info, setInfo] = useState({
    id: "",
    password: ""
  })



  const handleChange = (e) => {
    const{name,value} = e.target
    const infoCopy = {...info}
    infoCopy[name] = value
    setInfo(infoCopy)
  }

   const handleDropdown = (e) => {
    const access = e.target.value
    setwebAccess(access)
  }

  const handleLogin = async (e) => {
    e.preventDefault()

    const {id, password} = info
    setInfo((prev) => ({      ...prev,
      webAccess: webAccess
    }))

    if(!id || !password || !field.includes(webAccess)){
      return handleError("All fields are required")
    }

    try {
      // const url = `${API_BASE_URL}feedback/login`
      let url
        url = `${API_BASE_URL}${webAccess.toLowerCase()}/feedback/login`
      const response = await fetch(url, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(info)
      })
      

      const result = await response.json()

      const {success, message, jwtToken, fullName,id, department, monthYear, error} =  result


      if (success) {
        handleSuccess(message),
        localStorage.setItem('token', jwtToken)
        localStorage.setItem('fullName', fullName)
        localStorage.setItem('id', id)
        localStorage.setItem('department', department)
        localStorage.setItem('monthYear', monthYear)
        navigate("/feedback/form", {replace: true})
      }
      else if (error) {
        const details = error?.details[0].message;
        handleError(details)
      }
      else if(!success) {
        handleError(message)
      }

    } catch (error) {
      handleError(error)
    }


  }






    return (
            <>
              <ToastContainer />

              <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                  <img
                    alt="Your Company"
                    src= {logo}
                    className="mx-auto h-25 w-auto"
                  />
                  <h2 className="mt-3 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
                    Login
                  </h2>
                </div>
        
                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                  <form onSubmit={handleLogin}  className="space-y-6">
    
                    <div>
                      <label htmlFor="id" className="block text-sm/6 font-medium text-gray-900">
                        ID
                      </label>
                      <div className="mt-2">
                        <input
                          onChange={handleChange}
                          value={info.id}
                          id="id"
                          name="id"
                          type="text"
                          required
                          autoComplete="id"
                          className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                        />
                      </div>
                    </div>
        
                    <div>
                      <div className="flex items-center justify-between">
                        <label htmlFor="password" className="block text-sm/6 font-medium text-gray-900">
                          Password
                        </label>
                        {/* <div className="text-sm">
                          <a href="#" className="font-semibold text-indigo-600 hover:text-indigo-500">
                            Forgot password?
                          </a>
                        </div> */}
                      </div>
                      <div className="mt-2">
                        <input
                          onChange={handleChange}
                          value={info.password}
                          id="password"
                          name="password"
                          type="password"
                          required
                          autoComplete="current-password"
                          className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                        />
                      </div>
                    </div>
                        
                    <div>
                      <select 
                      value = {webAccess}
                      className="px-6 py-2 border border-gray-300 rounded-md" name="Department" id="Department" onChange={handleDropdown}>
                        <option disabled >Access</option>
                        {field?.map((item,index) => {
                          return <option value={item} key={index}>{item}</option>
                        })}
                      </select>
                    </div>
                <div></div>

                    <div>
                      <button
                        type="submit"
                        className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                      >
                        Sign In
                      </button>
                    </div>
                  </form>
                  <ToastContainer /> 
                </div>
              </div>
              
            </>

          )
}


export default EmployeeLogin;