import React, { useState } from "react";
import logo from "../assets/Logo.jpg"
import {ToastContainer} from "react-toastify"
import { handleError, handleSuccess } from "../utils";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate()
  const [info, setInfo] = useState({
    email: "",
    password: ""
  })

  const handleChange = (e) => {
    const{name,value} = e.target
    const infoCopy = {...info}
    infoCopy[name] = value
    setInfo(infoCopy)
  }

  const handleLogin = async (e) => {
    e.preventDefault()

    const {email, password} = info

    if(!email || !password){
      return handleError("All fields are required")
    }

    try {
      const url = "http://localhost:8000/auth/login"
      const response = await fetch(url, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(info)
      })

      const result = await response.json()
      
      const {success, message, jwtToken, name, isAdmin, error} =  result


      if (success) {
        handleSuccess(message),
        localStorage.setItem('token', jwtToken)
        localStorage.setItem('loggedInUser', name)
        localStorage.setItem('isAdmin', isAdmin)
        setTimeout(() => {
          navigate('/rating')
        }, 1000);
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
                      <label htmlFor="email" className="block text-sm/6 font-medium text-gray-900">
                        Email address
                      </label>
                      <div className="mt-2">
                        <input
                          onChange={handleChange}
                          value={info.email}
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
                      <button
                        type="submit"
                        className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                      >
                        Sign In
                      </button>
                    </div>
                  </form>
                  <ToastContainer />
                  <div className="mt-4"><span className="text-gray-400"> Don't have an account?</span> <Link to="/register">Sign Up</Link></div>  
                </div>
              </div>
            </>
          )
}

// export{
//   Login,
//   // isAdmin
// }

export default Login