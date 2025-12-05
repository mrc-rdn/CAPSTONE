import React, {useState, useEffect} from 'react'
import axios from 'axios';
import Navbar from './components/Navbar'
import Header from './components/Header'
import CourseModal from './components/UI/modal/CourseModal'
import Course from './components/course/Course'

import { API_URL } from '../../api';

export default function AdminModules() {
  const [isModal, setIsModal] = useState(false)
  const [courseData, setCourseData] = useState([]);
  const courses = courseData
  
     function handleExit(exit){
       setIsModal(exit)
     }
     function handleModal(){
      setIsModal(true)
     }
         
     
     useEffect(()=>{
      async function fetchData(){
        try {
          const response = await axios.get(`${API_URL}/admin/course`, {withCredentials: true})
          setCourseData(response.data.data)
         
          
        } catch (error) {
          console.log(error)
        }
        
      }
      fetchData();
     },[])
    
    
  return (
    <div className="flex w-screen h-screen ">
        <Navbar />
        <div className='w-full bg-gray-200 '>
          <Header title="Course"/>
          <div className='flex flex-wrap w-full h-11/12 overflow-y-scroll'>
            <button 
              onClick={handleModal}
              className='w-65 h-40 bg-white border-green-500 border-3 rounded-xl m-5 text-3xl font-medium text-green-700' >
              Create Course
            </button>
            
            {courses.length > 0 ? (courses.map((course)=>{
              return(
              <Course 
              
              id={course.id}
              key={course.id}
              title={course.title} 
              description={course.description} 
              
              />
              
              )
            })
            ): (<p>No Course Found</p>)
          }
          </div>
          

          
          
        </div>
        
        { isModal?<CourseModal onExit={handleExit} />: null}
        
    </div>
  )
}
