import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { isTokenValid } from "./JwtChecker.js";


const RefreshHandler = ({setIsAuthenticated, isAuthenticated}) => {

    const navigate = useNavigate()
    const location = useLocation()

    useEffect(() => {
        // console.log("Running for ", location.pathname)
        if(localStorage.getItem("token"))
            {
                console.log(`${location.pathname} = ${isAuthenticated}`)
                if(isTokenValid(localStorage.getItem("token")))
                    {
                        setIsAuthenticated(true)
                        console.log(`running for ${location.pathname}`)
                        if(location.pathname === '/' || 
                            location.pathname === '/login'
                        ) 
                        {
                            navigate('/rating')
                        }
                    } else{
                        setIsAuthenticated(false)
                    }
                }else{
                    setIsAuthenticated(false)
                }


    })

    return (
        null
    )
}

const AdminHandler = ({setIsAdmin}) =>
{
    useEffect(() => {

        if(localStorage.getItem("isAdmin")){
            if(isTokenValid(localStorage.getItem("token")))
            {
            setIsAdmin(true)
        }
    }

    }) 

    return null
}


export { RefreshHandler, AdminHandler }