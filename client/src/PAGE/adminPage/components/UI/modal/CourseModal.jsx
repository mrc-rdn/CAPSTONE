import React, {useState} from 'react'
import axios from 'axios'
import CloseIcon from '@mui/icons-material/Close';
import { API_URL } from '../../../../../api';
export default function CourseModal(props) {
    const exit = false; 
    const [title, setTitle] = useState("");
    const [description , setDescription] = useState("");
    const [isMouseOver, setMouseOver] = useState(false)
    

    async function handleSubmit(){
        try {
            const response = await axios.post(
                `${API_URL}/admin/course/createcourse`, 
                {title: title, description: description},
                {withCredentials: true}
            )
            console.log(`nice i hadle it well`, response.data)
        } catch (error) {
            console.log(error)
        }
    } 
    
  return (
    
    <div className='w-full h-full bg-gray-400/50 grid place-items-center absolute  '>
      <div className='w-3/12 h-6/12 bg-green-700 text-white p-2 '>
        <button className='m-3'
        onClick={()=>{props.onExit(exit)}}><CloseIcon /></button>
        <h1 className='m-2'>CREATE COURSE</h1>
        
        <form className='text-white flex-col flex items-center w-full' >
          <div className=' flex flex-col '>
            <label >Course</label>
            <input type="text" className=' w-full h-10 text-2xl bg-green-500 rounded p-1' placeholder='Course' onChange={(e)=>{setTitle(e.target.value)}} value={title}  />
          </div>
          <div className=' flex flex-col'>
             <label >Description</label>
              <input type="text" className=' w-full h-10 text-2xl bg-green-500 rounded p-1' placeholder='Description' onChange={(e)=>{setDescription(e.target.value)}} value={description}/>
          </div>
           
            <button type="submit"
              className={
                isMouseOver
                  ? 'm-3 w-7/12 h-3/12 text-2xl text-white bg-yellow-500 rounded '
                  : 'm-3 w-7/12 h-3/12 text-2xl text-yellow-500 bg-white border-2 rounded '
              }
              onMouseOver={() => setMouseOver(true)}
              onMouseOut={() => setMouseOver(false)}
             onClick={handleSubmit}
            >Submit</button>
        </form>
        
      </div>
    </div>
    
  )
}
