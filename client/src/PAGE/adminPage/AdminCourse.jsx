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
  const [refresh, setRefresh] = useState(0)
  const courses = courseData
  
     function handleExit(exit){
       setIsModal(exit)
     }
     function handleModal(){
      setIsModal(true)
     }
         
     const handleRefresh = ()=>{
      setRefresh(prev => prev + 1)
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
     },[refresh])
    
    
  return (
    <div className="flex w-screen h-screen ">
        <Navbar />
        <div className='w-full bg-gray-200 '>
          <Header title="Course"/>
          <div className='flex flex-wrap w-full h-11/12 overflow-y-scroll'>
            
            {courses.length > 0 ? (courses.map((course)=>{
              return(
              <Course 
              
              id={course.id}
              key={course.id}
              title={course.title} 
              description={course.description} 
              handleRefresh={handleRefresh}
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
