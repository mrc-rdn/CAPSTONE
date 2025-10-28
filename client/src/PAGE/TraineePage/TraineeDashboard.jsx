import React, {useEffect, useState} from 'react'
import Navbar from './components/Navbar'
import axios from 'axios'

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
      <h1>{data.username}</h1>
    </div>
  )
}
