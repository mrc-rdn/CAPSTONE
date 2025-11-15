import React, {useState, useEffect} from 'react'
import axios from 'axios';
import Navbar from './components/Navbar'
import Header from './components/Header'
import CourseModal from './components/CourseModal'
import Course from './components/Course'
import SelectedCourse from './components/SelectedCourse'

export default function AdminModules() {
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
          const response = await axios.get('http://localhost:3000/admin/course', {withCredentials: true})
          setData(response.data.data)
         
          
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
          <div className='flex flex-wrap w-full '>
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
        { isSelectedCourse? <SelectedCourse handleBack={handleExitSelectedCourse} data_course={data.find((course)=> {return course.id === id})} />: null }
        { isModal?<CourseModal onExit={handleExit} />: null}
        
    </div>
  )
}
