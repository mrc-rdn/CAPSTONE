import React, {useState} from 'react'
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';

export default function DeleteContent(props) {
    const {isVideo, isQuiz, quizData, videoData} = props
    const handleDelete = async() => {
        props.onRefresh();
        try {
            const res = await axios.delete('http://localhost:3000/admin/course/deletecontent', {
                data: {
                    isVideo,
                    isQuiz,
                    quizData,
                    videoData
                },
                withCredentials: true
                })

            console.log(res)
        } catch (error) {
            console.log(error)
        }
    }
  return (
    <div className='absolute z-100 bg-gray-500/40 w-full h-full flex justify-center items-center'>
      <button 
      onClick={handleDelete}
      className='w-60 h-20 border-2 border-red-500 rounded-2xl text-large text-white font-bold bg-red-500 flex justify-center items-center'>
        <div className='w-15 h-15 rounded-full bg-white grid place-items-center mr-3'><DeleteIcon fontSize='large' className='text-red-500'/></div>
        DELETE CONTENT
        </button>
    </div>
  )
}
