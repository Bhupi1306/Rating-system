import React, { useEffect, useState } from "react";
import logo from "../assets/Logo.jpg"
import { Link, useLocation, useNavigate } from "react-router-dom";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// "Employees", "Dealers", "Suppliers"


const Navbar = () => {
    const navigate = useNavigate()

    const [navAuth, setNavAuth] = useState(false)
    const [token, setToken] = useState(localStorage.getItem("token") || "");

    const navLinks = "ml-10 hover:text-blue-700 transition duration-300"
    const [webAccess, setwebAccess] = useState("")

    const verify = async () => {
         const url = `${API_BASE_URL}auth/verify`
        const response = await fetch(url, {
              method: "POST",
              headers: {
                'content-type':'application/json'
              },
            body: JSON.stringify({token})
          })

      const result = await response.json()
      return result.success
    }
    

useEffect(()=>{

    if(!token){
        setNavAuth(false)
    }else{
       const success = verify()
       if (success){
            setNavAuth(true)
        }
    }

    setwebAccess(localStorage.getItem("webAccess"))

},[navAuth, token, navigate,setToken])

useEffect(() => {
    const currentPath = location.pathname;

    console.log("Current Path:", currentPath);
},[location.pathname])

    const navRoutes = {
        Admin: <>
        <li className={navLinks}><a href="/register">New user</a> </li> </>,

        Employees: <><li className={navLinks}><a href="/rating">Rating</a></li>
        <li className={navLinks}><a href="/add">Add Employee</a> </li> 
        <li className={navLinks}> <a href="/remove">Remove Employee</a></li> </>,

        Suppliers: <><li className={navLinks}><a href="/supplier/rating">Rating</a></li>
        <li className={navLinks}><a href="/supplier/add">Add Supplier</a> </li> 
        <li className={navLinks}> <a href="supplier/remove">Remove Supplier</a></li> </>,

        Dealers: <><li className={navLinks}><a href="/dealer/rating">Rating</a></li>
        <li className={navLinks}><a href="/dealer/add">Add Dealer</a> </li> 
        <li className={navLinks}> <a href="/dealer/remove">Remove Dealer</a></li> </>
    }



    const handleClick = () => 
    {
        localStorage.clear()
        setNavAuth(false)
        navigate("/", {replace: true})
        setTimeout(() => { 
            window.location.reload()
        }, 50);
    }

    const logoClick = () => 
    {
        if(webAccess === "Admin"){navigate("/admin")}
        else if(webAccess === "Employees"){navigate("/rating")}
        else if(webAccess === "Dealers"){navigate("/dealer/rating")}
        else if(webAccess === "Suppliers"){navigate("/supplier/rating")}
    }
    return (
        <>
        {navAuth &&
        <div className="flex justify-between content-center px-10">
            <div className="shrink-0">
                <img src={logo} className="h-20" alt="LOGO" onClick={logoClick} />
            </div>
            <div className="content-center">
                <ul className="flex  items-center">
                    {navRoutes[webAccess]}
                    <button onClick={handleClick} className="
                    bg-indigo-700
                    text-white
                    rounded-md 
                    ml-10
                    py-2
                    px-4
                    hover:bg-indigo-600 
                    transtion
                    duration-300
                    "><li>Logout</li></button>
                </ul>
            </div>
        </div>
}
        </>
    )
}


export default Navbar