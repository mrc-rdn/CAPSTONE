import React, {useState} from 'react';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios'

export default function AddTraineeModal(props) {
    const exit = false
    const [studentId, setStudentId] = useState("")
    const [studentName, setStudentName] = useState("")

  return (
    <div className='w-full h-full bg-gray-500/80 absolute grid place-items-center'>
      <div className='w-150 h-100 bg-white p-3'>
        <button onClick={()=>{props.onExit(exit)}}><CloseIcon /></button>   
        
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
          <div className='w-full flex flex-col m-3'>
            <label>Student Name</label>
            <input
            className='w-7/12 h-10 text-2xl bg-green-500 rounded p-1 m-1'
            type="text"
            required
            placeholder='Student Name'
            onChange={(e)=> setStudentName(e.target.value)} 
            value={studentName}/>
          </div>
          
          <div className='w-full flex justify-center'>
            <button 
            className='m-3 w-50 h-10 text-2xl text-white bg-green-500 rounded'
            >
            Enroll
          </button>
          </div>
          
        </div>
      </div> 
    </div>
  )
}
