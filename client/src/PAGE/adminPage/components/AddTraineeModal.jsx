import React from 'react';
import CloseIcon from '@mui/icons-material/Close';

export default function AddTraineeModal(props) {
    const exit = false
  return (
    <div className='w-full h-full bg-gray-500/40 absolute grid place-items-center'>
      <div className='w-350 h-150 bg-white'>

      
        <button onClick={()=>{props.onExit(exit)}}><CloseIcon /></button>   
        <h1>Trainee</h1>
      </div> 
    </div>
  )
}
