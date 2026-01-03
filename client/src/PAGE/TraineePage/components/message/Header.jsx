import React from 'react'

export default function Header(props) {
  return (
    <div className='flex w-full h-1/12 bg-white '>
      <div className='h-full flex items-center ml-3 w-full'>
        <h1 className='text-xl font-bold text-green-700'>{props.title}</h1>
       
        <button onClick={()=>{props.handleOpenAddContactModal()}} className='ml-auto m-4'>Add contacts</button>
      </div>
    </div>
  )
}
