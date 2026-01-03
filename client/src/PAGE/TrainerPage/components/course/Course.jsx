import React,{useEffect,useState} from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios';
import { API_URL } from '../../../../api';

export default function Course(props) {
    const open = true
    const [enrolled, setenrolled] = useState([])
    function slugify(text) {
      return text.toLowerCase().replace(/\s+/g, '-');
    } 
    useEffect(()=>{
      const fetchData = async()=>{
        
          const res = await axios.get(`${API_URL}/trainer/${props.id}/enrolled`,{withCredentials:true})
          setenrolled(res.data.data)
        
      }   
      fetchData() 
    },[])
  return (
    <div className=''>
      <div className=' shadow-[4px_4px_0px_0px_rgba(128,128,128,1)] w-65 h-50 bg-green-700 m-4 rounded-xl p-3 '>
        
        <p className='text-3xl font-bold text-white'>{props.title}</p>
        <p className='text-gray-200 m-1'>{props.description}</p>

        <p className='text-white w-25 h-10 flex items-center justify-center border rounded-xl mb-3 mt-3'>{enrolled.length} Student</p>
        <Link to={`/trainer/course/${props.id}/${slugify(props.title)}`}>
        <button 
        className='w-full h-10 bg-white rounded-lg '
        >
          ENTER SUBJECT
        </button>
        </Link>
      </div>
    </div>
  )
}
