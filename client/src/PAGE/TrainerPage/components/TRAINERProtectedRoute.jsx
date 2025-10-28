import React, { useEffect, useState } from 'react'
import { Navigate } from "react-router-dom";
import axios from "axios";



export default  function ProtectedRoute({children}) {
    const [isAuth, setAuth] = useState(null);

    useEffect(()=>{
         async function fetchAuth(){ 
            try {
             const response = await axios.get("http://localhost:3000/trainer/dashboard", {withCredentials: true}) 
             setAuth(response.data.success) 
            } catch (error) {
             setAuth(false)
            } 
        } fetchAuth();
    }, [])

    if (isAuth === null) return(<p>Loading...</p>)
    return(isAuth? children: <Navigate to="/trainer/login" />)
  
}
