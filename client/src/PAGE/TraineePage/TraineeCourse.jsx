import React, {useState, useEffect} from 'react'
import axios from 'axios'
import Navbar from './components/Navbar'
import Header from './components/Header'
import Course from './components/Course';
import SelectedCourse from './components/SelectedCourse';
import { API_URL } from '../../api';

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
            
      <Navbar/>
      
      <div className='w-full bg-gray-200'>
        <Header title="Course" />
        <div className='flex flex-wrap w-full '>
        
          {courses.length > 0 ? (courses.map((course)=>{
            return(
            <Course 
            id={course.id}
            key={course.id}
            title={course.title} 
            description={course.description} 
            handleOpen={handleSelectedCourse}
            />
            
            )
          })
          ): (<p>No Courses Found You are not currently enrolled in any courses</p>)
        }
        </div>
        
      </div>      
      { isSelectedCourse? <SelectedCourse handleBack={handleExitSelectedCourse} data_course={data.find((course)=> {return course.id === id})} />: null }
    </div>
      
  )
}
