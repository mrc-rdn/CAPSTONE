import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Navbar from './components/Navbar.jsx'
import Header from './components/Header.jsx'
import Course from './components/course/Course.jsx'
import CourseModal from './components/UI/modal/CourseModal.jsx'
import { API_URL } from '../../api.js'


export default function My_Batch() {
  const [isModal, setIsModal] = useState(false)
  const [isSelectedCourse, setSelectedCourse] = useState(false)
  const [id, setId] = useState()
  const [data, setData] = useState([]);
  const courses = data;
  function handleExit(exit) {
    setIsModal(exit)
  }
  function handleModal() {
    setIsModal(true)
  }
  function handleSelectedCourse(id, open) {

    setId(id)
    setSelectedCourse(open)
  }
  function handleExitSelectedCourse(exit) {
    setSelectedCourse(exit)
  }

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get(`${API_URL}/trainer/course`, { withCredentials: true })
        setData(response.data.data)

        console.log(response.data)
      } catch (error) {
        console.log(error)
      }

    }
    fetchData();
  }, [])
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
        <Header title="Course" />
        <div className='flex flex-wrap w-full h-11/12 overflow-y-scroll'>
          <button 
            onClick={handleModal}
            className='w-65 h-50 m-4 p-4 rounded-2xl bg-white/25 backdrop-blur-md border border-white/30 shadow-lg text-3xl text-[#2D4F2B] font-bold' >
            Create Course
          </button>
          {courses.length > 0 ? (courses.map((course) => {
            return (
              <Course

                id={course.id}
                key={course.id}
                title={course.title}
                description={course.description}

              />

            )
          })
          ) : (<p>No Course Found</p>)
          }
        </div>




      </div>

      {isModal ? <CourseModal onExit={handleExit} /> : null}

    </div>

  )
}
