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
                `${API_URL}/trainer/course/createcourse`, 
                {title: title, description: description},
                {withCredentials: true}
            )
            console.log(`nice i hadle it well`, response.data)
        } catch (error) {
            console.log(error)
        }
    } 
    
  return (
    
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-xl bg-white rounded-xl shadow-lg">
        <div className="flex items-center px-6 py-4 border-b border-[#6F8A6A]/40">
          <button className='w-9 h-9 flex items-center justify-center text-[#2D4F2B]'
          onClick={()=>{props.onExit(exit)}}><CloseIcon /></button>
          <h1 className='text-xl font-semibold text-[#2D4F2B] ml-8'>CREATE COURSE</h1>
        </div>
        <div className="px-6 py-6">
        <form className="flex flex-col gap-4" >
          <div className=' flex flex-col '>
            <label >Course</label>
            <input type="text" className="
                  h-10 px-3
                  rounded-lg
                  border border-[#6F8A6A]
                  bg-white
                  text-[#2D4F2B]
                  focus:outline-none
                  focus:ring-2
                  focus:ring-[#FFB823]
                " placeholder='Course' onChange={(e)=>{setTitle(e.target.value)}} value={title}  />
          </div>
          <div className=' flex flex-col'>
             <label >Description</label>
              <input type="text" className="
                  h-10 px-3
                  rounded-lg
                  border border-[#6F8A6A]
                  bg-white
                  text-[#2D4F2B]
                  focus:outline-none
                  focus:ring-2
                  focus:ring-[#FFB823]
                " placeholder='Description' onChange={(e)=>{setDescription(e.target.value)}} value={description}/>
          </div>
          <div className="w-full flex justify-center mt-6">
            <button type="submit"
              className="
                  w-60 h-11
                  rounded-xl
                  font-semibold
                  bg-[#2D4F2B]
                  text-white
                  hover:bg-[#708A58]
                  transition
                "
              
             onClick={handleSubmit}
            >Submit</button>
          </div>
        </form>
        </div>
      </div>
    </div>
    
  )
}
