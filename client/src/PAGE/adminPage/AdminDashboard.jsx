import React, { useEffect, useState } from 'react'
import Navbar from './components/Navbar'

import Dcontent from './components/dashboard/DContent.jsx'
import CalendarTodo from './components/dashboard/CalendarTodo.jsx'
import axios from 'axios'
import { API_URL } from '../../api'
import Profile from './components/dashboard/Profile.jsx'

import UpcomingEvents from './components/dashboard/UpcomingEvents.jsx'
import Courses from './components/dashboard/courses.jsx'

export default function AdminDashboard() {
  const [data, setData] = useState([])
  const [color, setcolor] = useState({ color: null, shade: null })
  const [upcomingEventsData, setUpcomingEventData] = useState([])
  const [courses, setCourseData] = useState([])
  const [refresh, setRefresh] = useState(0)


  useEffect(() => {
    async function fetchData() {
      try {
        const [response, course] = await Promise.all([
          axios.get(`${API_URL}/admin/dashboard`, { withCredentials: true }),
          axios.get(`${API_URL}/admin/course`, { withCredentials: true })])
        setCourseData(course.data.data)
        setData(response.data)
      } catch (error) {

      }
    }
    fetchData()

  }, [])

  const handleRefresh = () => {
    setRefresh(prev => prev + 1)

  }

  const colorMap = {
    red: { 200: 'bg-red-200', 300: 'bg-red-300', 400: 'bg-red-400', 500: 'bg-red-500', 600: 'bg-red-600', 700: 'bg-red-700', 800: 'bg-red-800' },
    yellow: { 200: 'bg-yellow-200', 300: 'bg-yellow-300', 400: 'bg-yellow-400', 500: 'bg-yellow-500', 600: 'bg-yellow-600', 700: 'bg-yellow-700', 800: 'bg-yellow-800' },
    green: { 200: 'bg-green-200', 300: 'bg-green-300', 400: 'bg-green-400', 500: 'bg-green-500', 600: 'bg-green-600', 700: 'bg-green-700', 800: 'bg-green-800' },
    orange: { 200: 'bg-orange-200', 300: 'bg-orange-300', 400: 'bg-orange-400', 500: 'bg-orange-500', 600: 'bg-orange-600', 700: 'bg-orange-700', 800: 'bg-orange-800' },
    blue: { 200: 'bg-blue-200', 300: 'bg-blue-300', 400: 'bg-blue-400', 500: 'bg-blue-500', 600: 'bg-blue-600', 700: 'bg-blue-700', 800: 'bg-blue-800' },
    purple: { 200: 'bg-purple-200', 300: 'bg-purple-300', 400: 'bg-purple-400', 500: 'bg-purple-500', 600: 'bg-purple-600', 700: 'bg-purple-700', 800: 'bg-purple-800' },
    pink: { 200: 'bg-pink-200', 300: 'bg-pink-300', 400: 'bg-pink-400', 500: 'bg-pink-500', 600: 'bg-pink-600', 700: 'bg-pink-700', 800: 'bg-pink-800' },
  }

  const userColorClass = colorMap[data.color]?.[data.shade] || 'bg-gray-500';
  const handleUpcomingEventData = (data) => {
    setUpcomingEventData(data)
    console.log(data)
  }

  return (
    <div className="flex w-screen h-screen">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <img
          src="/images/plmro.jpg"
          alt="Dashboard background"
          className="w-full h-full object-cover scale-105 "
        />
      </div>


      <Navbar />
      <div className="w-full flex flex-col relative ">

        <div className="absolute inset-0 bg-white/5 -z-0"></div>

        <div className="px-4 pt-4">
          <div className="flex w-full h-16 backdrop-blur-md bg-
              border border-black/10 rounded-xl shadow-md">
            <div className="h-full flex items-center w-full">
              <h1 className="text-xl font-bold text-[#2D4F2B]  ml-3">Dashboard</h1>
              <Profile data={data} userColorClass={userColorClass} />
            </div>
          </div>
        </div>

        <div className="h-[calc(100%-4rem)] w-full overflow-y-scroll relative z-10 px-4">



          <div className='m-3 h-full flex gap-8 p-8'>
            <div className='w-8/12 h-full flex flex-col gap-8'>
              <div className='w-full flex flex-col items-center'>
                <Dcontent traineeCount={data.traineeCount} trainerCount={data.trainerCount} coursesCount={data.coursesCount} />
              </div>
              <div
                className="
              w-full h-8/12
              rounded-lg
              border border-white/5
              bg-white/30
              backdrop-blur-md
            "
                style={{ boxShadow: "3px 3px 5px rgba(0,0,0,0.1)" }}
              >
                <div className="w-30 h-10 flex items-center justify-center ">
                  <p className="text-[#2D4F2B] text-lg font-bold">Courses</p>
                </div>


                <div className="w-full h-10/12 rounded-br-md 
                              flex flex-wrap justify-center
                               backdrop-blur-md
                              border border-white/5">

                  {courses.length > 0 ? (courses.map((course) => {
                    return (
                      <Courses key={course.id} course={course} />

                    )
                  })
                  ) : (<p>No Course Found</p>)
                  }
                </div>


              </div>

            </div>
            <div className='w-4/12 flex flex-col gap-8'>
              <div className='w-full h-100'>
                <CalendarTodo handleUpcomingEventData={handleUpcomingEventData} onRefresh={handleRefresh} />
              </div>

              <div
                className="
                  h-5/12
                  rounded-2xl
                  flex items-center flex-col
                  backdrop-blur-md
                  bg-white/15
                  border border-white/30
                  shadow-xl
                "
              >
                <div className="w-full">
                  <p className="my-3 ml-5 font-bold text-lg text-[#2D4F2B]">
                    Upcoming
                  </p>
                </div>


                <div className='h-35 w-11/12 overflow-y-scroll '>
                  {upcomingEventsData.map((item, index) => {
                    return <UpcomingEvents key={index} text={item.text} eventDate={item.event_date} color={item.color} refresh={refresh} />
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