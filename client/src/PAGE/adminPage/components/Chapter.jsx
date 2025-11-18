import React from 'react'


export default function Chapter(props) {
  return (
    <div className=''>
        
            <div 
              className='w-full h-18 bg-green-500 border-gray-200 border-2 flex flex-col p-2'
              onClick={()=>{props.handleOpenChapter(props.id, props.chapter_no)}}>
                <p className='text-2xl font-normal'>{props.title}: </p> 
                <p className='text-gray-900/60'>{props.description}</p>
            </div>

    </div>
  )
}
