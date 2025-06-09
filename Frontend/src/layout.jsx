import React, { use } from "react";
import Navbar from "./components/Navbar";
import { Outlet, useLocation } from "react-router-dom";




const Layout = ({isAuthenticated, setIsAuthenticated}) => {

    return (
        <>

            <Outlet/>
        </>
    )
}


export default Layout