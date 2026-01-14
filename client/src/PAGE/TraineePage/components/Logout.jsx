import React from 'react'
import {Link, useNavigate} from "react-router-dom"
import axios from 'axios';
import { API_URL } from '../../../api.js';


export default function Logout() {
    const navigate = useNavigate();

    async function handleLogout(event){
        event.preventDefault();
        try {
            const res = await axios.post(`${API_URL}/trainee/dashboard/logout`, {}, { withCredentials: true })
           console.log(res.data)
            
          if (res.data.message === "Successfully logged out") {
              navigate(res.data.redirectTo);
          }
        } catch (error) {
            console.log("logout error",error.message)
        }
    }
  return (
   <div className='flex flex-col gap-6 px-4'>
      <button onClick={handleLogout} className=" w-full
    flex items-center justify-center gap-2
    px-4 py-3
    rounded-xl
    font-semibold
    text-[#2D4F2B]
    bg-white/20
    backdrop-blur-md
    border border-white/30
    shadow-md
    hover:bg-red-500/20
    hover:text-[#CF0F0F]
    hover:border-red-400/40
    transition-all duration-200">Logout</button>
    </div>
  )
}