import React, {useEffect, useState} from 'react'
import axios from 'axios'

import Navbar from './components/Navbar'
import Header from "./components/Header"
import Content from "./components/DContent"


const API_URL = "http://localhost:3000/trainer/dashboard"

export default function TrainerDashboard() {

  const [data, setData] = useState([]);
  const [ traineeCount, setTraineeCount] = useState([])
  const {username, password, role,  first_name, surname} = data

  useEffect(()=>{
    async function fetchdata(){
      try {
        const response = await axios.get(API_URL, {withCredentials: true})
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
    <div className="flex w-screen h-screen ">
      <Navbar />
      <div className='w-full bg-gray-200'>
        <Header title="Dashboard"/>
        <div>
          <Content  name={first_name} surname={surname} role={role} traineeCount={traineeCount}/>
        </div>
      </div>
    </div>
       
  )
}

