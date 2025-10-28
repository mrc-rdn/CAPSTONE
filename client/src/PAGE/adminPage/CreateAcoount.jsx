import React, {useState} from 'react'
import Navbar from './components/Navbar'
import Header from './components/Header'
import CAContent from './components/CAContent'
import axios from 'axios';


export default function CreateAcoount() {

  
  return (
    <div className="flex w-screen h-screen ">
        <Navbar />
        <div className='w-full bg-gray-200'>
          
          <Header title="Create Account" />
          <CAContent />
        </div>
    </div>
  )
}
