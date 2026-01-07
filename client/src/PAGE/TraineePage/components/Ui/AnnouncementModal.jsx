import React, {useEffect, useState, useRef} from 'react'
import {Link, Navigate} from 'react-router-dom'
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
import { API_URL } from '../../../../api.js';


export default function AddChapterModal(props) {
    const exit = false
    const [title, setTitle] = useState("");
    const [message, setMessage] = useState("");
    const [isMouseOver, setMouseOver] = useState(false)

    const [isTextArea, setIsTextArea] = useState(false)
    const textareaRef = useRef(null);
   
    const [announcement, setAnnouncement] = useState([]);
    const fectchdata = async()=>{
      const fetch = await axios.get(`${API_URL}/trainee/announcement/${props.courseId}`, {withCredentials:true})
      setAnnouncement(fetch.data)
          
    }

    const readNotif = async ()=>{
      await axios.get(`${API_URL}/trainee/announcement/${props.courseId}/read-in`, {withCredentials:true})
    }

    useEffect(() => {
      readNotif()
      fectchdata()

    }, [props.courseId]);
   
    

    


  return (
    <div className='w-full h-full bg-gray-500/40 fixed inset-0 flex items-center justify-center z-100 '>
      <div className='w-full h-full bg-white p-3 rounded'>


        <button onClick={()=>{props.onExit(exit);}}><CloseIcon /></button>
        <h1  className='text-2xl mt-3 ml-6'>Announcement</h1>
        <div>
          {
            announcement.map((item, index)=>{
              return <div key={index} className="max-w-xl mx-auto my-4 p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition">
                        <h2 className="text-xl font-bold text-gray-800 mb-2">{item.title}</h2>
                        <p className="text-gray-600 break-words">{item.message}</p>
                      </div>
            })
          }
        </div>
       
      

        

      </div> 
    </div>
  )
}
