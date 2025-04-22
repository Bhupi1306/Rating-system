import React from "react";
import logo from "../assets/Logo.jpg"
import { Link, useNavigate } from "react-router-dom";


const Navbar = () => {
    const navigate = useNavigate()

    const navLinks = "ml-10 hover:text-blue-700 transition duration-300"
    const handleClick = () => 
    {
        localStorage.clear()
        navigate("/login")
    }
    return (
        <>
        <div className="flex justify-between content-center px-10">
            <div className="">
                <img src={logo} className="h-20" alt="LOGO" onClick={navigate('/rating')} />
            </div>
            <div className="content-center">
                <ul className="flex  items-center">
                    <li className={navLinks}><a href="/rating">Rating</a></li>
                    <li className={navLinks}><a href="/add">Add Employee</a> </li> 
                    <li className={navLinks}> <a href="/remove">Remove Employee</a></li>
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
        </>
    )
}


export default Navbar