import React, {useState, useEffect} from 'react'
import axios from 'axios'
import { API_URL } from '../../../../api'



export default function courses({ course}) {
    const [enrolled, setenrolled] = useState([])
    useEffect(()=>{
      const fetchData = async()=>{
        
          const res = await axios.get(`${API_URL}/admin/${course.id}/enrolled`,{withCredentials:true})
          setenrolled(res.data.data)
        
      }   
      fetchData() 
    },[])

    console.log(enrolled)
  return (
     <div className='w-58 h-30 bg-green-600 m-2 rounded-lg'> 
                        
        <p className='text-lg m-2 mb-1 font-bold text-white'>{course.title}</p>
        <p className='text-sm ml-3 text-gray-300'>{course.description}</p>

        <div >
          <p className='text-white w-20 h-10 text-xs flex items-center justify-center rounded-xl mb-3 mt-3'>{enrolled.length} Student</p>
            
        </div>
        
    </div>
  )
}
