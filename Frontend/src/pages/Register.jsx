import React, { useState } from "react";
import logo from "../assets/Logo.jpg"
import {ToastContainer} from "react-toastify"
import { handleError, handleSuccess } from "../utils";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Register = () => {

  const field = ["Employees", "Dealers", "Suppliers"]


  const navigate = useNavigate()
  const [webAccess, setwebAccess] = useState('Access')

  const [info, setInfo] = useState({
    fullName: "",
    email: "",
    password: "",
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

  const handleSignUp = async (e) => {
    e.preventDefault()
    setInfo((prev) => ({
      ...prev,
      webAccess: webAccess
    }))

    const {fullName, email, password} = info

    if(!fullName || !email || !password || !field.includes(webAccess)){
      return handleError("All fields are required")
    }

    try {
      const url = `${API_BASE_URL}auth/register`
      const response = await fetch(url, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(info)
      })

      const result = await response.json()
      
      const {success, message, error} =  result

      console.log(message)

      if (success) {
        handleSuccess(message)
        setInfo((prev) => ({...prev, fullName:"", email: "", password:""}))
        setwebAccess("Access")
      }
      else if (error) {
        const details = error?.details[0].message;
        handleError(details)
      }
      else if(!success) {
        handleError(message)
      }

    } catch (error) {
      handleError(err)
    }


  }

    return (
        <>
          {/*
            This example requires updating your template:
    
            ```
            <html class="h-full bg-white">
            <body class="h-full">
            ```
          */}
          <Navbar />


          <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 xl:mx-auto xl:max-w-md">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
              {/* <img
                alt="Your Company"
                src= {logo}
                className="mx-auto h-25 w-auto"
              /> */}
              <h2 className="mt-3 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
                Registration
              </h2>
            </div>
    
            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
              <form onSubmit={handleSignUp}  className="space-y-6">
                <div>
                  <label htmlFor="fullName" className="block text-sm/6 font-medium text-gray-900">
                    FullName
                  </label>
                  <div className="mt-2">
                    <input
                      onChange={handleChange}
                      value = {info.fullName}
                      id="fullName"
                      name="fullName"
                      type="text"
                      required
                      autoComplete="fullName"
                      className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm/6 font-medium text-gray-900">
                    Email address
                  </label>
                  <div className="mt-2">
                    <input
                      onChange={handleChange}
                      value = {info.email}
                      id="email"
                      name="email"
                      type="email"
                      required
                      autoComplete="email"
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
                      value = {info.password}
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
                        {field.map((item,index) => {
                          return <option value={item} key={index}>{item}</option>
                        })}
                      </select>
                    </div>
    
                <div>
                  <button
                    type="submit"
                    className=" mt-10 flex w-full justify-center rounded-lg bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    Create User
                  </button>
                </div>
              </form>
              <ToastContainer />
              {/* <div className="mt-4"><span className="text-gray-400">Already have an account?</span> <Link to="/login"> Log in</Link></div>   */}
            </div>
          </div>
        </>
      )
}

export default Register