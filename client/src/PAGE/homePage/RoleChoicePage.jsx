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
      <div className='flex justify-between'>
        <div>
          <header className='absolute z-2 flex items-center h-30'>
            <img src="./public/images/logo2.gif" alt="" className="h-20 ml-10 mr-5"/>
            <h1 className='text-3xl font-bold text-green-800'>E-Kabuhayan</h1>
          </header>
          <img src="../public/images/plrmo-office.png" alt="" className='h-full absolute z-1' />
        </div>
        
        <div className="w-130 bg-green-700 h-screen z-2 flex items-center flex-col pt-20">
          <img src="./public/images/logo2.gif" alt="" className="h-30 mb-3"/>
          <h1 className='text-3xl text-white mb-3'>Hi, TRAINEE!</h1>

          <div className='flex items-center justify-center h-10'>
            <span className='text-3xl text-white'>↓</span>
            <p className='text-1xl text-white mt-1 ml-1'>Please click or tap your destination.</p>
          </div>

            <button 
            onClick={()=>{handleRoleSelection("trainer")}}
            className='w-100 h-12 bg-white m-3'>
            TRAINER
            </button>

            <button 
            onClick={()=>{handleRoleSelection("trainee")}}
            className='w-100 h-12 bg-white m-3'>
            TRAINEE
            </button>

            <button className='text-red-800 font-bold'><Link to="/">BACK</Link></button>
        </div>
      </div>
    </div>
  )
}
