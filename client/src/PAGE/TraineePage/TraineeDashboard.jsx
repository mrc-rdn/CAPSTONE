import React, {useEffect, useState} from 'react'
import Navbar from './components/Navbar'
import axios from 'axios'
import Header from './components/Header'

export default function TraineeDashboard() {
  const [data , setData] = useState([])
  

  useEffect(()=>{
    async function fecthData(){
    try {
      const response = await axios.get("http://localhost:3000/trainee/dashboard", {withCredentials: true})
      setData(response.data.data)
    } catch (error) {
      console.log(error)
    }
  }
  fecthData()
  }, [])

  
  console.log(data)
  
  return (
    <div className='flex h-full w-full'>
      <Navbar />
      <div className='w-full bg-gray-200'>
        <Header title="Dashoard" />
      </div>
      
    </div>
  )
}
