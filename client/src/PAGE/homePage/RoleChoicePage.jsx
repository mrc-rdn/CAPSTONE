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
            <div className="absolute inset-0 bg-[#2D4F2B]" />

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
                className='inline-block px-30 py-3 m-3 rounded-2xl font-bold text-[#FFF1CA] 
                bg-[#2D4F2B] border-1 border-[#708A58]
                shadow-[0px_5px_0px_0px_#708A58]
                hover:translate-y-[5px]
                hover:shadow-none
                hover:bg-[#708A58]
                
                
                transition-all duration-150 ease-in-out'>
                TRAINER
              </button>

              <button 
                onClick={()=>{handleRoleSelection("trainee")}}
                className='inline-block px-30 py-3 m-3 mb-8 rounded-2xl font-bold text-[#FFF1CA] 
                bg-[#2D4F2B] border-1 border-[#708A58]
                shadow-[0px_5px_0px_0px_#708A58]
                hover:translate-y-[5px]
                hover:shadow-none
                hover:bg-[#708A58]
                
                
                transition-all duration-150 ease-in-out'>
                TRAINEE
              </button>

              <button className='text-[#FFB823]/80 font-bold '>
                <Link to="/">BACK</Link>
              </button>

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}