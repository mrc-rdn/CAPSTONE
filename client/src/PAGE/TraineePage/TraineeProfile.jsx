import React, {useEffect} from 'react'
import Navbar from './components/Navbar.jsx'
import Header from './components/Header.jsx'
import { useState } from 'react'
import axios from 'axios'
import { API_URL } from '../../api.js'

import PersonRoundedIcon from '@mui/icons-material/PersonRounded';

export default function Profile() {
  const [user, setuser] = useState([]) 
  const [data, setData] = useState([]);
    const courses = data; 
  useEffect(()=>{
    async function fetchdata (){
            try {
                const result = await axios.get(`${API_URL}/trainee/dashboard`, {withCredentials:true})
                setuser(result.data.data)
                
            } catch (error) {
                console.log(error)
            }
        }
        fetchdata()
  },[]);
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
        <Header title="Profile" />  
        <div className="max-w-xl mx-auto bg-white shadow-xl rounded-2xl p-6 mt-10">
          <div className="flex items-center mb-6">
            <div className="w-20 h-20 rounded-full bg-green-200 flex items-center justify-center text-3xl font-bold text-green-800">
              <PersonRoundedIcon sx={{ fontSize: 50 }} />
            </div>
            <div className="ml-4">
              <h2 className="text-3xl font-semibold text-gray-800">
                {user.first_name} {user.surname}
              </h2>
              <p className="text-gray-500 text-lg">User ID: {user.id}</p>
            </div>
          </div>

          <div className="mt-4">
            <h3 className="text-lg font-medium text-gray-700 mb-2">Enrolled Courses</h3>
            <div className='flex flex-wrap w-full '>
                <div>
                    <ul className="space-y-2">
                       {courses.length > 0 ? (courses.map((course, index)=>{
                        return(<li
                          key={index}
                          className="bg-green-500 text-white p-5 rounded-lg shadow-sm "
                        >{course.title}
                          
                        </li>)}))
                         : (<p>You are not currently enrolled in any courses</p>)
}
                    </ul>
                </div>

              
                    
             
              </div>
          </div>
        </div>
      </div>
    </div>
      
  )
}
