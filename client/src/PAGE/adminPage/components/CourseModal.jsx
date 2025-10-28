import React, {useState} from 'react'
import axios from 'axios'
import CloseIcon from '@mui/icons-material/Close';

export default function CourseModal(props) {
    const exit = false; 
    const [title, setTitle] = useState("");
    const [description , setDescription] = useState("");
    

    async function handleSubmit(){
        try {
            const response = await axios.post(
                'http://localhost:3000/admin/course/createcourse', 
                {title: title, description: description},
                {withCredentials: true}
            )
            console.log(`nice i hadle it well`, response.data)
        } catch (error) {
            console.log(error)
        }
    } 
    
  return (
    
    <div className='w-full h-full bg-gray-400/50 grid place-items-center absolute '>
      <div className='w-100 h-100 bg-green-700 '>
        <button onClick={()=>{props.onExit(exit)}}><CloseIcon /></button>
        <h1>CREATE COURSE</h1>
        
        <form >
            <label >Course</label>
            <input type="text" placeholder='Course' onChange={(e)=>{setTitle(e.target.value)}} value={title}  />
            <label >Description</label>
            <input type="text" placeholder='Description' onChange={(e)=>{setDescription(e.target.value)}} value={description}/>
            <button type="submit" onClick={handleSubmit}>Submit</button>
        </form>
        
      </div>
    </div>
    
  )
}
