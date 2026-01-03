import React, {useState} from 'react'
import DehazeIcon from '@mui/icons-material/Dehaze';
import EditIcon from '@mui/icons-material/Edit';



export default function Chapter(props) {
  
  function handleClick(){
    props.handleOpenChapter(props.id, props.chapter_no)
    props.handleActiveChapter(props.id)
    console.log()
  }

  return (
    <div 
      className={`  h-15 lg:h-18 bg-green-500 border-gray-200 border-2 flex flex-row p-2 hover:bg-green-600 
        ${props.isActive ? "bg-green-600": "bg-green-500"} `}onClick={handleClick}>
        <div>
          <p className='md:text-lg lg:text-2xl font-normal'>{props.title}: </p> 
          <p className='text-xs lg:text-base text-gray-900/60'>{props.description}</p>
        </div>
        {props.isEditChapter?
        <div className='ml-auto flex flex-row'>
          <div className=' m-3'>
            <button onClick={()=>{props.isEditChapter
              ?(props.handleShowEditChapterModal(props.id, props.chapter_no, props.title, props.description), props.onRefresh())
              :null}}>
              <EditIcon />
            </button>
          </div>
          <div className=' m-3'>
            <DehazeIcon />
          </div>
        </div>
        :null
        }
        
    </div>

    
  )
}
