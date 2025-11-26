import React, {useState} from 'react'
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
import DeleteIcon from '@mui/icons-material/Delete';
import { API_URL } from '../../../api';

export default function EditChapterModal(props) {
    const exit = false
    const {chapterId, chapter_index, chapter_title, chapter_description} = props.chapterData;
    const [chapterTitle, setChapterTitle] = useState("");
    const [chapterPrevTitle, setChapterPrevTitle] = useState(chapter_title)
    const [chapterDescription, setChapterDescription] = useState("");
    const [chapterPrevDescription, setChapterPrevDescription] = useState(chapter_description)
    const [isDeleted, setDelete] = useState(false)

    const [isChapterAdded, setChapterAdded] = useState(false);
    const [isMouseOver, setMouseOver] = useState(false)
    console.log(chapterId, chapter_index, chapter_title, chapter_description)
    async function handleSubmit(e){
      e.preventDefault();
      
      try {
        const result = axios.put(`${API_URL}/admin/course/editchapter`, 
            {title: chapterTitle, description: chapterDescription, courseId: props.courseId, chapterId:chapterId},
            {withCredentials: true})
        setChapterAdded(true)
        console.log(result)
      } catch (error) {
        console.log(error)
      }
        
        
    }
    const handleDelete = async (e) =>{
      e.preventDefault();
      try {
        const res = await axios.delete(`${API_URL}/admin/chapter/deletechapter/${props.chapter_Details.id}`,{
          withCredentials: true
          })
          console.log(res)
          setDelete(true)
          setChapterAdded(true)
      } catch (error) {
        console.log('error deleting chapter',error)
      }
    }

  return (
    <div className='w-full h-full absolute bg-gray-500/40 grid place-items-center z-200'>
      <div className='w-130 h-90 bg-white p-3 rounded '>
        <button onClick={()=>{props.onExit(exit); props.onRefresh(props.chapter_Details.id);}}><CloseIcon /></button>
        <div className="w-full flex flex-row items-center">
          <h1  className='text-2xl mt-3 mb-3 '>Edit Chapter</h1>
          <button 
          onClick={handleDelete}
          className='ml-auto mr-3 m-3 text-large text-green-500 bg-white border-2 rounded p-3'>
            <DeleteIcon fontSize="small" className='mr-2'/>Delete Chapter</button>
        </div>
        
       {isChapterAdded?<h1>{isDeleted?'Chapter is Deleted':'Chapter is Added'}</h1>: <form onSubmit={handleSubmit} 
        className='flex flex-col items-center'>
          <div className='w-100 flex flex-col m-3'>
            <label >Chapter Title</label>
            <input 
            className='w-full h-10 text-2xl bg-green-500 rounded p-1'
            onChange={(e)=>{setChapterTitle(e.target.value), setChapterPrevTitle(e.target.value) }}
            type="text" 
            maxLength="25"
            required
            placeholder='Chapter title'
            value={chapterPrevTitle} />
          </div>
            
          <div className='w-100 flex flex-col m-3'>
            <label>Description</label>
            <input 
            className='w-full h-10 text-2xl bg-green-500 rounded p-1'
            onChange={(e)=>{setChapterDescription(e.target.value), setChapterPrevDescription(e.target.value)}}
            type="text" 
            maxLength='40'
            required
            placeholder='Description' 
            value={chapterPrevDescription}/>   <label htmlFor=""></label>
           
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
