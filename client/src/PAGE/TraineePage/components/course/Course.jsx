import React from 'react'
import { Link } from 'react-router-dom'

export default function Course(props) {
    const open = true
    function slugify(text) {
          return text.toLowerCase().replace(/\s+/g, '-');
      } 
      
  return (
    <div>
  

  <div className="w-65 h-50 m-4 p-4 rounded-2xl bg-white/25 backdrop-blur-md border border-white/30 shadow-lg flex flex-col justify-between">

    <div>
      <p className="text-2xl font-bold text-[#2D4F2B]">
        {props.title}
      </p>

      <p className="text-sm text-[#5F7A61] mt-1">
        {props.description}
      </p>
    </div>

    <div className="flex justify-between mt-4">
      <p className="w-28 h-9 flex items-center justify-center rounded-xl bg-white/40 text-[#2D4F2B] text-sm font-medium">
         Student
      </p>

      
    </div>

    <Link to={`/trainee/course/${props.id}/${slugify(props.title)}`}>
      <button className="w-full h-10 mt-4 rounded-xl bg-white/70 text-[#2D4F2B] font-semibold hover:bg-green-600 hover:text-white transition">
        ENTER SUBJECT
      </button>
    </Link>
  </div>
</div>
  )
}
