import React, { useState } from "react";
import {ToastContainer} from "react-toastify"
import { handleError, handleSuccess } from "../utils";
import Navbar from "./Navbar";

const DeleteObject = (checkLink, delLink, Object) => {
  const [visibility, setVisibility] =  useState("hidden")
  const [cardOpacity, setCardOpacity] =  useState("opacity-0")
  const [cardScale, setCardScale] =  useState("scale-0")
  
  const [id, setId] = useState("")
  const [name, setName] = useState("")
  const [department, setDepartment] = useState("")

  const hideCard = () => 
  {
    setVisibility("hidden")
    setCardOpacity("opacity-100")
    setCardScale("scale-100")
  }


  const handleChange = (e) => {
    setId(e.target.value)
  }



  // When deny is pressed
  const handleDeny = () => 
  {
    hideCard()
  }




  const handleAccept = async () =>
  {
    try {
      const url = delLink
      const response = await fetch(url, {
              method: "POST",
              headers: {
                'content-type':'application/json'
              },
              body: JSON.stringify({id})
            })

      const result = await response.json()

      if(result.success)
      {
        hideCard()
        handleSuccess( `${Object} Deleted successfully`)
        setId("")
      }

      
    } catch (error) {
      handleError(error)
    }
  }


  //Initial Enter
  const handleSubmit = async (e) => {
    e.preventDefault()

    if(!id){
      return handleError("All fields are required")
    }

    try{
      const url = checkLink
      const response = await fetch(url, {
              method: "POST",
              headers: {
                'content-type':'application/json'
              },
              body: JSON.stringify({id})
            })

      const result = await response.json()

      if(result.success) 
        {
        setId(id)
        setName(result.fullName)
        setDepartment(result.department)
        setVisibility("visible")
        setCardOpacity("opacity-100")
        setCardScale("scale-100")
      }
      else if (!result.success)
      {
        setId("")
        handleError(result.message)
      }
            
    }
    catch(error)
    {
      handleError(error)
    }  
  }



    return (
            <>
              <Navbar />
              <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8 mt-18 relative ">
                <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                  <h2 className="mt-3 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
                    Delete {Object}
                  </h2>
                </div>
        
                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                  <form onSubmit={handleSubmit}  className="space-y-6">

                    <div>
                        <input type="Text" value={id} onChange={handleChange} placeholder={`${Object} ID`} className="rounded-md w-2xs bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" />
                        <button className="ml-4 rounded-md bg-indigo-600 px-5 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Enter</button>
                    </div>
                  </form>
                  <ToastContainer /> 
                </div>



                <div id="deleteCard" className={`${visibility} ${cardOpacity} ${cardScale} h-auto bg-indigo-200 text-neutral-content w-96 rounded-md absolute m-auto top-0 right-0 bottom-0 left-0`}>
                    <div className="p-10 items-center">
                        <h2 className="card-title text-2xl text-center mb-4">Are you Sure??</h2>
                        <p>{Object} ID: {id}</p>
                        <p>Name: {name}</p>
                        <p>Department: {department}</p>
                        <div className="text-center mt-4">
                            <button 
                            onClick={handleAccept}
                            className="rounded-md bg-indigo-700 px-5 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Accept</button>
                            <button 
                            onClick={handleDeny}
                            className="rounded-md ml-1.5 px-5 py-1.5 text-sm/6 font-semibold text-white  hover:bg-indigo-500 shadow-xs focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Deny</button>
                        </div>
                    </div>
                </div>
              </div>
            </>
          )
}

export default DeleteObject