import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { isTokenValid } from "./JwtChecker";


const AuthChecker = ({setIsAuthenticated}) => {

    const navigate = useNavigate()
    const location = useLocation()

    useEffect(() => {
        console.log("Auth for ", location.pathname)
        if(localStorage.getItem("token")){
            if(isTokenValid(localStorage.getItem("token")))
            {
            setIsAuthenticated(true)

            // if(location.pathname === '/' || 
            //     location.pathname === '/login'
            // ) {
            //     navigate('/rating')
            // }
        }
    }


    })

    return (
        null
    )
}


export { AuthChecker}