import React, {useEffect, useState} from 'react'
import axios from 'axios'

import Navbar from './components/Navbar.jsx'
import Header from "./components/Header.jsx"
import Content from "./components/DContent.jsx"
import CalendarTodo from './components/CalendarTodo.jsx'
import { API_URL } from '../../api.js'


export default function TrainerDashboard() {

  const [data, setData] = useState([]);
  const [ traineeCount, setTraineeCount] = useState([])
  const {username, password, role,  first_name, surname} = data

  useEffect(()=>{
    async function fetchdata(){
      try {
        const response = await axios.get(`${API_URL}/trainer/dashboard`, {withCredentials: true})
        setData(response.data.user)
        setTraineeCount(response.data.totalTrainee)
        
      } catch (error) {
        console.log("error fetching data", error)
      }
    }
    fetchdata()

  }, [])
  const colorMap = {
  green: { 400: 'bg-green-400', 500: 'bg-green-500' },
  red: { 400: 'bg-red-400', 500: 'bg-red-500' },
  blue: { 400: 'bg-blue-400', 500: 'bg-blue-500' },
};

const userColorClass = colorMap[data.color]?.[data.shade] || 'bg-gray-500';
 
  return (
    <div className="flex w-screen h-screen">
      <Navbar />
      <div className='w-full h-full bg-gray-200'>
        <div className='flex w-full h-1/12 bg-white '>
          <div className='h-full flex items-center w-full'>
            <h1 className='text-xl font-bold text-green-700 ml-3'>Dashboard</h1>
            
            <div className='flex items-center ml-auto mr-3'>
            <p>{data.usersInfo && data.usersInfo && data.usersInfo.first_name}</p>
              <div className='ml-2'>
                <div className={`w-11 h-11 rounded-full flex items-center justify-center ${userColorClass}`}>
                  <p>
                    {data.usersInfo && data.usersInfo && data.usersInfo.first_name.slice(0,1)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className=' w-full h-11/12 overflow-y-scroll flex flex-col items-center'>
          <Content  name={first_name} surname={surname} role={role} traineeCount={traineeCount}/>
          <div className='m-3'>
            <CalendarTodo />
          </div>
        </div>
      </div>
    </div>
       
  )
}

