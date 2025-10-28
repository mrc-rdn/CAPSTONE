import React from 'react'

export default function Header(props) {
  return (
    <div className='flex w-full h-15 bg-white '>
      <div className='h-full flex items-center ml-3'>
        <h1 className='text-xl font-bold text-green-700'>{props.title}</h1>
      </div>
    </div>
  )
}
