import React, {useState, useEffect} from 'react'
import axios from 'axios'
import Navbar from './components/Navbar.jsx'
import Header from './components/Header.jsx'
import Course from './components/course/Course.jsx';
import { API_URL } from '../../api.js';

export default function TraineeCourse() {
  const [id, setId] = useState()
  const [isSelectedCourse, setSelectedCourse] = useState(false)
  const [data, setData] = useState([]);
  const courses = data;

  function handleModal(){

  }
  function handleSelectedCourse(id, open){
  
    setId(id)
    setSelectedCourse(open)
  }
  function handleExitSelectedCourse(exit){
    setSelectedCourse(exit)
  }
   useEffect(()=>{
        async function fetchData(){
          try {
            const response = await axios.get(`${API_URL}/trainee/course`, {withCredentials: true})
            setData(response.data.data)
           
            
          } catch (error) {
            console.log(error)
          }
          
        }
        fetchData();
       },[])

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
                <Header title="Course"/>
                <div className='flex flex-wrap w-full h-11/12 overflow-y-scroll'>
                  
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
      
    </div>
      
  )
}
