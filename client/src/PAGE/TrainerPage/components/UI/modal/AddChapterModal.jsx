import React, {useState, useEffect} from 'react'
import {Link, Navigate} from 'react-router-dom'
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
import { API_URL } from '../../../../../api.js';



export default function AddChapterModal(props) {
    const exit = false
    const [chapterTitle, setChapterTitle] = useState("");
    const [description, setDescription] = useState("");
    const [isChapterAdded, setChapterAdded] = useState(false);
    const [isMouseOver, setMouseOver] = useState(false)
    const [chapterLength, setChapterLength] = useState(0);
    useEffect(()=>{
      const fetchChapters = async () =>{
         const chapters = await axios.get(`${API_URL}/trainer/course/${props.courseId}`, { withCredentials: true })
         setChapterLength(chapters.data.data.length)
      }
       fetchChapters()
       
    }, [])

    const handleSubmit = async(e)=>{
      e.preventDefault()
      console.log(props.courseId,chapterLength, chapterTitle)
      try {
        const  result = await axios.post(`${API_URL}/trainer/course/addchapter`, 
          {courseId: props.courseId, chapterName: chapterTitle, description: description, chapterIndex: chapterLength + 1},
          {withCredentials:true})
          console.log(result)
          setChapterAdded(result.data.success)
      } catch (error) {
        setChapterAdded(false)
        console.log(error)
      }
      
    }

  return (
    <div className='w-full h-full bg-gray-500/40 fixed inset-0 flex items-center justify-center z-200  '>
      <div className='w-10/12 h-100 bg-white p-3 rounded lg:w-4/12'>


        <button onClick={()=>{props.onExit(exit);}}><CloseIcon /></button>
        <h1  className='text-2xl mt-3 mb-3 '>Create Chapter</h1>
       {isChapterAdded
       ?<h1>Chapter is Added</h1>
       :<form  
        className='flex flex-col items-center '>
          <div className='w-10/12 flex flex-col m-3 '>
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
            
          <div className='w-10/12 flex flex-col m-3'>
            <label>Description</label>
            <input 
            className='w-full h-10 text-2xl bg-green-500 rounded p-1'
            onChange={(e)=>{setDescription(e.target.value)}}
            type="text" 
            maxLength='40'
            required
            placeholder='Description' 
            value={description}/>  
           
          </div>
                                 

            <button
              className={isMouseOver?'m-3 w-50 h-10 text-2xl text-white bg-green-500 rounded':'m-3 w-50 h-10 text-2xl text-green-500 bg-white border-2  rounded' }
              onMouseOver={()=> setMouseOver(true)}
              onMouseOut={()=> setMouseOver(false)}
              onClick={handleSubmit}>
                Submit
            </button>
        </form>
}
        

      </div> 
    </div>
  )
}
