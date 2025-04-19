import React, { useEffect, useState } from "react";

const Rating = () => {

    const [loggedInUser, setLoggedInUserr] = useState("")
    useEffect( () => {
        setLoggedInUserr(localStorage.getItem("loggedInUser"))
    })

    console.log(loggedInUser)

    return (
        <div>
            <h1>{loggedInUser}</h1>
        </div>
    )
}

export default Rating