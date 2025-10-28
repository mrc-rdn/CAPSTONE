import React from 'react'
import {Link, useNavigate} from "react-router-dom"
import axios from 'axios';

const API_URL = "http://localhost:3000/trainer/dashboard/logout"

export default function Logout() {
    const navigate = useNavigate();

    async function handleLogout(event){
        event.preventDefault();
        try {
            const res = await axios.post(API_URL, {}, { withCredentials: true })
           console.log(res.data)
            
          if (res.data.message === "Successfully logged out") {
              navigate(res.data.redirectTo);
          }
        } catch (error) {
            console.log("logout error",error.message)
        }
    }
  return (
    <div className='flex flex-col gap-6 mt-6 px-4'>
      <button onClick={handleLogout} className="flex items-center gap-2 text-white font-semibold hover:text-green-200">Logout</button>
    </div>
  )
}