import React, { useState, useEffect } from "react";
import logo from "../../assets/Logo.jpg"
import {ToastContainer} from "react-toastify"
import { handleError, handleSuccess } from "../../utils";
import { Link, useNavigate } from "react-router-dom";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const FeedbackForm = () => {
  const navigate = useNavigate()
  const [id, setId] = useState("");
  const [fullName, setFullName] = useState("");
  const [department, setDepartment] = useState("");
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [show, setShow] = useState(false);
  const [auth, setAuth] = useState("");

  const [info, setInfo] = useState({
    suggestion: "",
    problem: "",
    feedback: "",
    photo: null
  })

   const curMonth = new Date().toLocaleString("default",{month: "long"})
    const year = new Date().getFullYear()
    const monthYear = curMonth + year
    
    
    useEffect(()=>{
      const storedId = localStorage.getItem("id");
      const storedFullName = localStorage.getItem("fullName");
      const lastMonthYear = localStorage.getItem("monthYear");
      const storeDepartment = localStorage.getItem("department");

      const verifyLogin = async() => {
        if (!token) {
          navigate("/employee/login");
        }

        const url = `${API_BASE_URL}employee/verify`;
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token }),
        });


        if(!response.ok) {
          handleError("Invalid token, please login again");
          navigate("/employee/login");
          return;
        }
        const result = await response.json();

        if(result.auth !== "employee" || result.auth !== "dealer" || result.auth !== "supplier") {
          setAuth(result.auth);
        }
        else{
          handleError("You are not authorized to access this page");
          navigate("/employee/login");
          return;
        }
      };
    if (lastMonthYear === monthYear) {
      setShow(false);
    } else {
      setShow(true);
    }


    if (storedId && storedFullName && storeDepartment) {
      setDepartment(storeDepartment);
      setId(storedId);
      setFullName(storedFullName);
    } else {
      // Redirect to login or handle the case where id and fullName are not available
      navigate("/employee/login");
    }

      verifyLogin();

  
  }, [navigate]);

  const handleChange = (e) => {
    const{name,value} = e.target
    const infoCopy = {...info}
    infoCopy[name] = value
    setInfo(infoCopy)
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    console.log(file)
    setInfo((prevInfo) => ({
      ...prevInfo,
      photo: file
    }));
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

   


    const {suggestion, problem, feedback, photo} = info
    const formData = new FormData();

    formData.append("id", id);
    formData.append("token", token);
    formData.append("fullName", fullName);  
    formData.append("department", department);
    formData.append("monthYear", monthYear);
    formData.append("suggestion", suggestion);
    formData.append("problem", problem);
    formData.append("feedback", feedback);
    formData.append("photo", photo);
    
    try {
      let url;
      console.log(auth)
      url = `${API_BASE_URL}${auth}/feedback/form`

      const response = await fetch(url, {
        method: "POST",
        body: formData
      })


      const result = await response.json()

      const {success, message, error} =  result


      if (success) {
        handleSuccess(message)

      
        setShow(false)
       

      }
      else if (error) {
        handleError(message)
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
              {show && 

              <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                  <img
                    alt="Your Company"
                    src= {logo}
                    className="mx-auto h-25 w-auto"
                  />
                  <h2 className="mt-3 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
                    Feedback Form
                  </h2>
                </div>

                <div>
                  <h3 className="mt-1 sm:mx-auto sm:w-full sm:max-w-sm font-semibold tracking-tight text-gray-900">Id: {id}</h3>
                  <h3 className="mt-1 sm:mx-auto sm:w-full sm:max-w-sm font-semibold tracking-tight text-gray-900">Name: {fullName}</h3>
                </div>
        
                <div className="mt-5 sm:mx-auto sm:w-full sm:max-w-sm">
                  <form onSubmit={handleSubmit}  className="space-y-6">
    
                    <div>
                      <label htmlFor="suggestion" className="block text-sm/6 font-medium text-gray-900">
                        Suggestion
                      </label>
                      <div className="mt-2">
                        <input
                          onChange={handleChange}
                          value={info.suggestion}
                          id="suggestion"
                          name="suggestion"
                          type="textarea"
                          
                          className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                        />
                      </div>
                    </div>


                    <div>
                      <label htmlFor="problem" className="block text-sm/6 font-medium text-gray-900">
                        Problem
                      </label>
                      <div className="mt-2">
                        <input
                          onChange={handleChange}
                          value={info.problem}
                          id="problem"
                          name="problem"
                          
                          className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                        />
                      </div>
                    </div>

                    
                    <div>
                      <label htmlFor="feedback" className="block text-sm/6 font-medium text-gray-900">
                        Feedback
                      </label>
                      <div className="mt-2">
                        <input
                          onChange={handleChange}
                          value={info.feedback}
                          id="feedback"
                          name="feedback"
                          type="text"
                          
                          className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                        />
                      </div>
                    </div>
        
                  
                    <div>
                      <label htmlFor="photo" className="block text-sm/6 font-medium text-gray-900">
                        Upload Photo (jpg or png)
                      </label>
                      <div className="mt-2">
                        <input
                          onChange={handleFileChange}
                          id="photo"
                          name="photo"
                          type="file"
                          accept=".jpg,.jpeg,.png"
                          
                          className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                        />
                      </div>
                    </div>
        
                    <div>
                      <button
                        type="submit"
                        className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                      >
                        Submit
                      </button>
                    </div>
                  </form>
                  <ToastContainer /> 
                </div>
              </div>
              }

              {!show && 
                <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
                  <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                    <img
                      alt="Your Company"
                      src= {logo}
                      className="mx-auto h-25 w-auto"
                    />
                    <h2 className="mt-3 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
                      Feedback Form
                    </h2>
                  </div>
                  <div className="mt-5 sm:mx-auto sm:w-full sm:max-w-sm">
                    <p className="text-center text-lg/6 font-semibold text-gray-900">You have submitted your feedback for this month.</p>
                     <button
                        type="submit"
                        className="flex w-full mt-10 justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                      >
                        Home
                      </button>
                  </div>
                </div>
              }
            </>

          )
}


export {FeedbackForm}