import React from 'react'
import Navbar from './components/Navbar.jsx'
import Header from './components/Header.jsx'

export default function Messages() {
  return (
    <div className="flex w-screen h-screen">
            
        <Navbar/>
        
      <div className='w-full bg-gray-200'>
        <Header title="Messages" />
      </div>   
          
    </div>
      
  )
}
