import React, { useState } from "react";
import Navbar from "./components/Navbar";
import { Outlet } from "react-router-dom";



const Layout = ({isAuthenticated, setIsAuthenticated}) => {

    const [isAdmin, setIsAdmin] = useState()


    return (
        <>

            {isAuthenticated && <Navbar isAdmin={isAdmin} setIsAuthenticated={setIsAuthenticated} isAuthenticated={isAuthenticated} />}
            <Outlet/>
        </>
    )
}


export default Layout