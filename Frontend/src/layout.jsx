import React, { useState } from "react";
import Navbar from "./components/Navbar";
import { Outlet } from "react-router-dom";
import {AdminHandler, RefreshHandler} from "./components/RefresehHandler";
import { AuthChecker } from "./components/auth";


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