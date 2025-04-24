import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";


const refreshHandler = ({setIsAuthenticated, setIsAdmin}) => {

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

        if(localStorage.getItem("isAdmin")){
            setIsAdmin("true")
        }
    })

    return (
        null
    )
}


export default refreshHandler