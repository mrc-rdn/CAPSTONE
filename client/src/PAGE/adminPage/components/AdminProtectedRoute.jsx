import React,{useState, useEffect} from 'react'
import { Navigate } from 'react-router-dom'
import axios from "axios"
import { API_URL } from '../../../api'


export default function AdminProtectedRoute({children}) {
    const [isAuth, setAuth] = useState(null)

    useEffect(()=>{
        async function fetchAuth(){
            try {
                const res = await axios.get(`${API_URL}/admin/protectedroute`, {withCredentials: true}) 
                setAuth(res.data.success)
                console.log(res)
            } catch (error) {
                setAuth(false)
                console.log(error)
            }
        }
        fetchAuth()
    }, [])

    if(isAuth === null) return(<p>...Loading</p>)
  return (isAuth? children: <Navigate to="/trainer/login" />)
}
