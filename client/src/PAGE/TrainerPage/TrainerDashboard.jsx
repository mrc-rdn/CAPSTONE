import React, {useEffect, useState} from 'react'
import axios from 'axios'

import Navbar from './components/Navbar'
import Header from "./components/Header"
import Content from "./components/DContent"
import CalendarTodo from './components/CalendarTodo'
import { API_URL } from '../../api'


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
  console.log(traineeCount)
 
  return (
    <div className="flex w-full h-full">
      <Navbar />
      <div className='w-full h- full bg-gray-200'>
        <Header title="Dashboard"/>
        <div className=' w-full h-11/12 overflow-y-scroll flex flex-col items-center'>
          <Content  name={first_name} surname={surname} role={role} traineeCount={traineeCount}/>
          <CalendarTodo />
        </div>
      </div>
    </div>
       
  )
}

