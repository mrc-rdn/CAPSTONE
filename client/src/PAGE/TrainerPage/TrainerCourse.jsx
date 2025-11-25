import React, {useEffect, useState} from 'react'
import axios from 'axios'
import Navbar from './components/Navbar'
import Header from './components/Header'
import Course from './components/Course'
import CreateCourseModal from './components/CreateCourseModal'
import SelectedCourse from './components/SelectedCourse'


export default function My_Batch() {
    const [isModal, setIsModal] = useState(false)
    const [isSelectedCourse, setSelectedCourse] = useState(false)
    const [id, setId] = useState()
    const [data, setData] = useState([]);
    const courses = data;
    function handleExit(exit){
      setIsModal(exit)
    }
    function handleModal(){
      setIsModal(true)
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
          const response = await axios.get('http://localhost:3000/trainer/course', {withCredentials: true})
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
        <Header title="My Batch"/>
        <div className='flex flex-wrap w-full h-11/12 overflow-y-scroll '>
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
            handleOpen={handleSelectedCourse}
            />
            
            )
          })
          ): (<p>No Course Found</p>)
        }
        </div>
      </div>  
      { isModal?<CreateCourseModal onExit={handleExit} />: null}
      { isSelectedCourse? <SelectedCourse handleBack={handleExitSelectedCourse} data_course={data.find((course)=> {return course.id === id})} />: null }
      
    </div>
      
  )
}
