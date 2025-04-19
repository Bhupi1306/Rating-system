import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";


const refreshHandler = ({setIsAuthenticated}) => {

    const navigate = useNavigate()
    const location = useLocation()

    useEffect(() => {
        if(localStorage.getItem("token")){
            setIsAuthenticated(true)

            if(location.pathname === '/' || 
                location.pathname === '/register' ||
                location.pathname === '/login' ||
                location.pathname === '/home'
            ) {
                navigate('/rating')
            }
        }
    })

    return (
        null
    )
}


export default refreshHandler