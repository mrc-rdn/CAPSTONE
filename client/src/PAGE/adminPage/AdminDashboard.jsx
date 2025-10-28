import React, {useEffect, useState} from 'react'
import Navbar from './components/Navbar'
import Header from './components/Header'
import Dcontent from './components/DContent'
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
  console.log(data)
  
  return (
    <div className="flex w-screen h-screen ">
        <Navbar />
        <div className='w-full bg-gray-200'>
          
          <Header title="Dashboard" />
          <Dcontent  traineeCount={data.traineeCount} trainerCount={data.trainerCount} coursesCount={data.coursesCount}/>
        </div>
        
    </div>
  )
}
