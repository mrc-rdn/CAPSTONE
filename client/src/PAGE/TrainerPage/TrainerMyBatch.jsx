import React from 'react'

import Navbar from './components/Navbar'
import Header from './components/Header'
import MContent from './components/MContent'

export default function My_Batch() {
  return (
    <div className="flex w-screen h-screen">
            
      <Navbar/>
      <div>
        <Header title="My Batch"/>
        <div>
          <MContent />
        </div>
      </div>  
          
    </div>
      
  )
}
