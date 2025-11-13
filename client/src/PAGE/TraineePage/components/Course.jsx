import React from 'react'

export default function Course(props) {
    const open = true
  return (
    <div>
      <div className='w-65 h-40 bg-green-700 m-4 rounded-xl p-3'>
        <p className='text-2xl mb-0 font-bold text-white'>{props.title}</p>
        <p className='text-gray-200'>{props.description}</p>
        <button 
        className='w-58 h-10 bg-white rounded-lg mt-10'
        onClick={()=>{props.handleOpen(props.id, open)} }>ENTER SUBJECT</button>
      </div>
    </div>
  )
}
