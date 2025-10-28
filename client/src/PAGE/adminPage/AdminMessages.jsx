import React from 'react'
import Navbar from './components/Navbar'
import Header from './components/Header'

export default function AdminMessages() {
  return (
    <div className="flex w-screen h-screen ">
        <Navbar />
        <div className='w-full bg-gray-200'>
          
          <Header title="Messages" />
        </div>
    </div>
  )
}
