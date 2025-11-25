import React, {useEffect, useState} from 'react'
import Navbar from './components/Navbar'
import Header from './components/Header'
import Dcontent from './components/DContent'
import CalendarTodo from './components/CalendarTodo'
import axios from 'axios'

export default function AdminDashboard() {
  const [data , setData]= useState([])

  useEffect(()=>{
    async function fetchData(){
      try {
        const response = await axios.get('http://localhost:3000/admin/dashboard', {withCredentials: true});
        setData(response.data)
     
      } catch (error) {
        
      }
    }
    fetchData()
  },[])
  
  
  return (
    <div className="flex w-screen h-screen ">
        <Navbar />               
      <div className='w-full bg-gray-200 flex flex-col bg-gray-200'>
        <Header title="Dashboard" />
        <div className='w-full h-11/12 overflow-y-scroll flex flex-col items-center'>
          <Dcontent  traineeCount={data.traineeCount} trainerCount={data.trainerCount} coursesCount={data.coursesCount}/>
          <div className='m-3'>
            <CalendarTodo />
          </div>
          
        </div>
        
      </div>
      
    
        
    </div>
  )
}
