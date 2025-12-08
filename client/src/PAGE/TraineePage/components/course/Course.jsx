import React from 'react'
import { Link } from 'react-router-dom'

export default function Course(props) {
    const open = true
    function slugify(text) {
          return text.toLowerCase().replace(/\s+/g, '-');
      } 
  return (
    <div className=''>
      <div className=' shadow-[4px_4px_0px_0px_rgba(128,128,128,1)] w-65 h-50 bg-green-700 m-4 rounded-xl p-3 '>
        
        <p className='text-3xl font-bold text-white'>{props.title}</p>
        <p className='text-gray-200 m-1'>{props.description}</p>

        <p className='text-white w-25 h-10 flex items-center justify-center border rounded-xl mb-3 mt-3'>24 Student</p>
        <Link to={`/trainee/course/${props.id}/${slugify(props.title)}`}>
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
