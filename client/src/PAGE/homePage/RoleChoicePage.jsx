import React,{useState, useEffect} from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from "axios"

export default function RoleChoicePage() {
  
  const navigate = useNavigate();

  function handleRoleSelection(role){
    navigate(`/${role}/login`);
  }
  
  return (
    <div className=''>
      <div className='relative h-screen w-full overflow-hidden'>

        {/* BLURRED MAIN BACKGROUND */}
        <img
          src="./public/images/plmro.jpg"
          alt=""
          className='absolute inset-0 w-full h-full object-cover scale-110 blur-md'
        />

        {/* OVERLAY */}
        <div className="absolute inset-0 bg-black/20" />

        {/* MAIN CONTENT – CENTERED */}
        <div className="relative z-10 h-full flex items-center justify-center px-4">

          {/* IMAGE CONTAINER */}
          <div className="relative 
                          w-full max-w-[400px]
                          h-[520px]
                          rounded-2xl overflow-hidden shadow-2xl">

            {/* CONTAINER OVERLAY */}
            <div className="absolute inset-0 bg-black/40" />

            {/* CONTENT (UNCHANGED LOGIC) */}
            <div className="relative z-10 h-full flex flex-col items-center justify-center p-10">

              <img src="../public/images/logo2.gif" alt="" className="h-24 mb-4"/>

              <h1 className='text-3xl font-bold text-[#FFF1CA] mb-2'>
                Welcome!
              </h1>

              <p className='text-[#FFF1CA] mb-6'>
                Please choose your role.
              </p>

              <button 
                onClick={()=>{handleRoleSelection("trainer")}}
                className='w-full h-12 bg-[#FFF1CA] rounded-xl mb-3 font-semibold text-[#2D4F2B]
                transition-all duration-200
                hover:bg-[#708A58] hover:-translate-y-0.5 hover:shadow-md'>
                TRAINER
              </button>

              <button 
                onClick={()=>{handleRoleSelection("trainee")}}
                className='w-full h-12 bg-[#FFF1CA] rounded-xl mb-4 font-semibold text-[#2D4F2B]
                transition-all duration-200
                hover:bg-[#708A58] hover:-translate-y-0.5 hover:shadow-md'>
                TRAINEE
              </button>

              <button className='text-[#FFB823]/80 font-bold'>
                <Link to="/">BACK</Link>
              </button>

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}