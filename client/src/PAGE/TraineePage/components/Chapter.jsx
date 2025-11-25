import React, {useState} from 'react'
import DehazeIcon from '@mui/icons-material/Dehaze';
import EditIcon from '@mui/icons-material/Edit';



export default function Chapter(props) {
  
  function handleClick(){
    props.handleOpenChapter(props.id, props.chapter_no)
    props.handleActiveChapter()
    
  }

  return (
    <div 
      className={`w-full h-18 bg-green-500 border-gray-200 border-2 flex flex-row p-2 hover:bg-green-600 
        ${props.isActive ? "bg-green-600": "bg-green-500"} `}onClick={handleClick}>
        <div>
          <p className='text-2xl font-normal'>{props.title}: </p> 
          <p className='text-gray-900/60'>{props.description}</p>
        </div>
        
    </div>

    
  )
}
