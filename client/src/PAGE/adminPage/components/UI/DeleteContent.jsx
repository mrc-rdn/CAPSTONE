import React, {useState} from 'react'
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import { API_URL } from '../../../../api.js';

export default function DeleteContent(props) {
    const {isVideo, isQuiz, isCertificate,isText, videoData, quizData, certificateData, textData} = props
    
    const handleDelete = async() => {
        
      try {
        const res = await axios.delete(`${API_URL}/admin/course/deletecontent`, {
          data: {
            isVideo,
            isQuiz,
            isCertificate,
            isText,
            quizData,
            videoData,
            certificateData,
            textData
          },
            withCredentials: true
          })

        props.onRefresh();
      } catch (error) {
        console.log(error)
      }
    }
  return (
    
    <div className='absolute inset-0 z-100 bg-gray-500/40 w-full h-full flex justify-center items-center'>
      <button 
      onClick={handleDelete}
      className='w-60 h-20 border-2 border-red-500 rounded-2xl text-large text-white font-bold bg-red-500 flex justify-center items-center'>
        <div className='w-15 h-15 rounded-full bg-white grid place-items-center mr-3'><DeleteIcon fontSize='large' className='text-red-500'/></div>
        DELETE CONTENT
        </button>
    </div>
  
  )
}
