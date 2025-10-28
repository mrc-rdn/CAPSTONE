import React, {useState} from 'react'
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';


export default function AddChapterModal(props) {
    const exit = false
    const [chapterTitle, setChapterTitle] = useState("");
    const [description, setDescription] = useState("");
    const [order, setOrder] = useState("");
   

    
    async function handleSubmit(e){
      
        try {
          const response = await axios.post('http://localhost:3000/admin/course/addchapter',
            {course_id: props.course_id, chapter_name: chapterTitle, description: description, chapter_no: props.chapter_no + 1},
            {withCredentials:true}
          )  
         
        } catch (err) {
            console.log(err)
        }
        
        
        
    }

  return (
    <div className='w-full h-full bg-gray-500/40 absolute grid place-items-center'>
      <div className='w-250 h-150 bg-white'>

      
        <button onClick={()=>{props.onExit(exit)}}><CloseIcon /></button>
        <form onSubmit={handleSubmit} 
        className='flex'>
            <input 
            className='w-100 h-10 text-2xl bg-green-500 m-3'
            onChange={(e)=>{setChapterTitle(e.target.value) }}
            type="text" 
            placeholder='Chapter title'
            value={chapterTitle} />

            <input 
            className='w-100 h-10 text-2xl bg-green-500 m-3'
            onChange={(e)=>{setDescription(e.target.value)}}
            type="text" 
            placeholder='Description' 
            value={description}/>

            
            

            

            <button
              className='w-50 h-10 text-2xl bg-green-500'
              type='submit'>Submit</button>
        </form>

        

      </div> 
    </div>
  )
}
