import React, {useEffect, useState} from 'react'
import Navbar from './components/Navbar'
import Header from './components/Header'
import Dcontent from './components/dashboard/DContent.jsx'
import CalendarTodo from './components/dashboard/CalendarTodo.jsx'
import axios from 'axios'
import { API_URL } from '../../api'
import Profile from './components/dashboard/Profile.jsx'
import Course from './components/course/Course.jsx'
import UpcomingEvents from './components/dashboard/UpcomingEvents.jsx'

export default function AdminDashboard() {
  const [data , setData]= useState([])
  const [color, setcolor] = useState({color:null, shade:null})
  const [upcomingEventsData, setUpcomingEventData] = useState([])
  
  useEffect(()=>{
    async function fetchData(){
      try {
        const response = await axios.get(`${API_URL}/admin/dashboard`, {withCredentials: true});
        setData(response.data)
      } catch (error) {
        
      }
    }
    fetchData()
    
  },[])

  const colorMap = {
    red: {200: 'bg-red-200',300: 'bg-red-300',400: 'bg-red-400',500: 'bg-red-500',600: 'bg-red-600',700: 'bg-red-700', 800: 'bg-red-800'},
    yellow: {200: 'bg-yellow-200',300: 'bg-yellow-300',400: 'bg-yellow-400',500: 'bg-yellow-500',600: 'bg-yellow-600',700: 'bg-yellow-700',800: 'bg-yellow-800'},
    green: {200: 'bg-green-200',300: 'bg-green-300',400: 'bg-green-400',500: 'bg-green-500',600: 'bg-green-600',700: 'bg-green-700',800: 'bg-green-800'},
    orange: {200: 'bg-orange-200',300: 'bg-orange-300',400: 'bg-orange-400',500: 'bg-orange-500',600: 'bg-orange-600',700: 'bg-orange-700',800: 'bg-orange-800'},
    blue: {200: 'bg-blue-200',300: 'bg-blue-300',400: 'bg-blue-400',500: 'bg-blue-500',600: 'bg-blue-600',700: 'bg-blue-700',800: 'bg-blue-800'},
    purple: {200: 'bg-purple-200',300: 'bg-purple-300',400: 'bg-purple-400',500: 'bg-purple-500',600: 'bg-purple-600',700: 'bg-purple-700',800: 'bg-purple-800'},
    pink: {200: 'bg-pink-200',300: 'bg-pink-300',400: 'bg-pink-400',500: 'bg-pink-500',600: 'bg-pink-600',700: 'bg-pink-700',800: 'bg-pink-800'},
  }

  const userColorClass = colorMap[data.color]?.[data.shade] || 'bg-gray-500';
  const handleUpcomingEventData = (data) =>{
    setUpcomingEventData(data)
    console.log(data)
  }

  return (
    <div className="flex w-screen h-screen ">
        <Navbar />   
      <div className={`w-full bg-gray-200/50 flex flex-col`}>
        <div className='flex w-full h-1/12 bg-white '>
          <div className='h-full flex items-center w-full'>
            <h1 className='text-xl font-bold text-green-700 ml-3'>Dashboard</h1>
            
            <Profile  data={data} userColorClass={userColorClass} />
          </div>
        </div>
      <div className='h-11/12 w-full overflow-y-scroll'>
        
        <div className='m-3 h-full flex gap-8 p-8'>
          <div className='w-8/12 h-full flex flex-col gap-8'>
            <div className='w-full flex flex-col items-center'>
              <Dcontent  traineeCount={data.traineeCount} trainerCount={data.trainerCount} coursesCount={data.coursesCount}/>
            </div>
            <div className='w-full h-6/12 bg-green-700 rounded-lg border-2 border-gray-200'
              style={{boxShadow: "3px 3px 5px rgba(0,0,0,0.1)"}}>
              <div className='w-50 h-10 flex items-center justify-center'>
                <p className='text-white text-lg '>Announcements</p>
              </div>
              
              <div className='bg-green-100 w-full h-30 rounded-br-md'>

              </div>


            </div>
            <div className='w-full h-6/12 bg-green-600 rounded-lg border-2 border-gray-200'
              style={{boxShadow: "3px 3px 5px rgba(0,0,0,0.1)"}}>

            </div>
          </div>
          <div className='w-4/12 flex flex-col gap-8'>
            <div className='w-full h-100'>
              <CalendarTodo handleUpcomingEventData={handleUpcomingEventData} />
            </div>
            
            <div className='h-5/12 rounded-lg bg-white flex items-center flex-col border-2 border-gray-200'
              style={{boxShadow: "3px 3px 5px rgba(0,0,0,0.1)"}}>
              <div className='w-full'>
                <p className=' my-3 ml-5 font-bold text-lg text-green-600'>Upcoming</p>
              </div>
              
              <div className='h-35 w-11/12 overflow-y-scroll '>
                {upcomingEventsData.map((item, index)=>{
                    return <UpcomingEvents key={index} text={item.text} eventDate={item.event_date} color={item.color} />
                  })

                }
              </div>
            </div>
          

          </div>
        </div>
          
        </div>
      </div>
        
      
      
    
        
    </div>
  )
}
