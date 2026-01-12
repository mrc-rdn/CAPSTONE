import React, {useState} from 'react'
import Navbar from './components/Navbar'
import Header from './components/Header'
import CAContent from './components/CAContent'
import axios from 'axios';


export default function CreateAcoount() {

  
  return (
    <div className="flex w-screen h-screen ">
      <div className="absolute inset-0 -z-10 overflow-hidden">
  <img
    src="/images/plmro.jpg"
    alt="Dashboard background"
    className="w-full h-full object-cover scale-105 "
  />
</div>
        <Navbar />
        <div className="w-full flex flex-col relative ">
          
          <Header title="Create Account" />
          <CAContent />
        </div>
    </div>
  )
}