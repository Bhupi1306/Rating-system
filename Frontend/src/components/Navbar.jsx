import React, { useEffect, useState } from "react";
import logo from "../assets/Logo.jpg"
import { Link, useNavigate } from "react-router-dom";

// "Employees", "Dealers", "Suppliers"


const Navbar = ({isAdmin, setIsAuthenticated, isAuthenticated}) => {
    const navigate = useNavigate()
    const [navAuth, setNavAuth] = useState(isAuthenticated)

    const navLinks = "ml-10 hover:text-blue-700 transition duration-300"
    const [webAccess, setwebAccess] = useState("")
    

useEffect(()=>{
    setTimeout(() => {
        setNavAuth(isAuthenticated)
    }, 1000);

    setwebAccess(localStorage.getItem("webAccess"))
    
})

    const navRoutes = {
        Admin: <>
        {isAdmin && <li className={navLinks}><a href="/register">Register</a></li>}
        <li className={navLinks}><a href="/register">New user</a> </li> </>,

        Employees: <><li className={navLinks}><a href="/rating">Rating</a></li>
        {isAdmin && <li className={navLinks}><a href="/register">Register</a></li>}
        <li className={navLinks}><a href="/add">Add Employee</a> </li> 
        <li className={navLinks}> <a href="/remove">Remove Employee</a></li> </>,

        Suppliers: <><li className={navLinks}><a href="/supplier/rating">Rating</a></li>
        {isAdmin && <li className={navLinks}><a href="/supplier/register">Register</a></li>}
        <li className={navLinks}><a href="/supplier/add">Add Supplier</a> </li> 
        <li className={navLinks}> <a href="supplier/remove">Remove Supplier</a></li> </>,

        Dealers: <><li className={navLinks}><a href="/dealer/rating">Rating</a></li>
        {isAdmin && <li className={navLinks}><a href="/dealer/register">Register</a></li>}
        <li className={navLinks}><a href="/dealer/add">Add Dealer</a> </li> 
        <li className={navLinks}> <a href="/dealer/remove">Remove Dealer</a></li> </>
    }



    const handleClick = () => 
    {
        localStorage.clear()
        setIsAuthenticated(false)
        setNavAuth(false)
        navigate("/", {replace: true})
        setTimeout(() => {
            
            window.location.reload()
        }, 100);
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
                    bg-blue-700
                    text-white
                    rounded-md 
                    ml-10
                    py-2
                    px-4
                    hover:bg-blue-600 
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