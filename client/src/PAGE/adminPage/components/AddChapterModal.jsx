import React, {useState} from 'react'
import {Link, Navigate} from 'react-router-dom'
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
import { API_URL } from '../../../api';


export default function AddChapterModal(props) {
    const exit = false
    const [chapterTitle, setChapterTitle] = useState("");
    const [description, setDescription] = useState("");
    const [isChapterAdded, setChapterAdded] = useState(false);
    const [isMouseOver, setMouseOver] = useState(false)
    

    
    async function handleSubmit(e){
      e.preventDefault();
        try {
          const response = await axios.post(`${API_URL}/admin/course/addchapter`,
            {course_id: props.course_id, chapter_name: chapterTitle, description: description, chapter_no: props.chapter_no + 1},
            {withCredentials:true}
          )  
          setChapterAdded(true)
        } catch (err) {
            console.log(err)
        }
        
        
        
    }

  return (
    <div className='w-full h-full bg-gray-500/40 absolute grid place-items-center z-200'>
      <div className='w-130 h-90 bg-white p-3 rounded'>


        <button onClick={()=>{props.onExit(exit); props.onRefresh(props.chapter_Details.id);}}><CloseIcon /></button>
        <h1  className='text-2xl mt-3 mb-3 '>Create Chapter</h1>
       {isChapterAdded?<h1>Chapter is Added</h1>: <form onSubmit={handleSubmit} 
        className='flex flex-col items-center'>
          <div className='w-100 flex flex-col m-3'>
            <label >Chapter Title</label>
            <input 
            className='w-full h-10 text-2xl bg-green-500 rounded p-1'
            onChange={(e)=>{setChapterTitle(e.target.value) }}
            type="text" 
            maxLength="25"
            required
            placeholder='Chapter title'
            value={chapterTitle} />
          </div>
            
          <div className='w-100 flex flex-col m-3'>
            <label>Description</label>
            <input 
            className='w-full h-10 text-2xl bg-green-500 rounded p-1'
            onChange={(e)=>{setDescription(e.target.value)}}
            type="text" 
            maxLength='40'
            required
            placeholder='Description' 
            value={description}/>   <label htmlFor=""></label>
           
          </div>
                                 
            

            <button
              className={isMouseOver?'m-3 w-50 h-10 text-2xl text-white bg-green-500 rounded':'m-3 w-50 h-10 text-2xl text-green-500 bg-white border-2  rounded' }
              onMouseOver={()=> setMouseOver(true)}
              onMouseOut={()=> setMouseOver(false)}
              type='submit'>
                Submit
            </button>
        </form>
}
        

      </div> 
    </div>
  )
}
