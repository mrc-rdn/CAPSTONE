import React, {useState} from 'react';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios'
import { API_URL } from '../../../../../api';

export default function AddTraineeModal(props) {
    const exit = false
    const [studentId, setStudentId] = useState("")
    const [isEnrolled, setEnrolled] = useState(false)

    async function handleEnroll(e){
      e.preventDefault()
      
      try {
        const response = await axios.post(`${API_URL}/trainer/course/enroll`,{courseId: props.courseId, studentId: studentId}, {withCredentials: true});
        setEnrolled(response.data.success)
        console.log(response)
      } catch (error) {
        console.log(`error handling the request ${error}`)
      }
    }


  return (
    <div className='w-full h-full bg-gray-500/80 fixed inset-0 grid place-items-center z-200'>
      <div className='w-150 h-100 bg-white p-3'>
        <button onClick={()=>{props.onExit(exit)}}><CloseIcon /></button>   
        {isEnrolled?<p>success enrollment</p>:
        <div className='flex flex-col'>
          <div>
            <h1 className='text-2xl mt-3 mb-3'>Add Trainee</h1>
          </div>
          
          <div className='w-full flex flex-col m-3'>
            <label>Student Id</label>
            <input 
            className='w-7/12 h-10 text-2xl bg-green-500 rounded p-1 m-1'
            type="text"
            required
            placeholder='Student Id'
            onChange={(e)=> setStudentId(e.target.value)}
            value={studentId}/>
          </div>
          
          <div className='w-full flex justify-center'>
            <button 
            className='m-3 w-50 h-10 text-2xl text-white bg-green-500 rounded'
            onClick={handleEnroll}>
              Enroll
            </button>
          </div>
          
        </div> }
      </div> 
    </div>
  )
}
