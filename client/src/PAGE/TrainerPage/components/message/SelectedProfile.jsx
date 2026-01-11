import React, {useEffect, useState} from 'react'
import {Link, Navigate} from 'react-router-dom'
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
import { API_URL } from '../../../../api.js';


export default function SelectedProfile(props) {
    const exit = false
    const [id, setId] = useState("");
    const [isContactAdded, setIsContactAdded] = useState(false)
    const [isAdded, setIsAdded] = useState("")
  
    const [isMouseOver, setMouseOver] = useState(false)
    const handleExit = ()=>{
      props.onExit(exit)
    } 
    const handleSubmit = async(e) =>{
      e.preventDefault();
      try {
        const addNewContacts = await axios.post(`${API_URL}/trainer/addContact`,{user2_id: props.id }, {withCredentials:true})
        let message = addNewContacts.data.message
        setIsContactAdded(true)
        setIsAdded(message)
        
      } catch (error) {
        console.log('error adding contacts', error)
      }
    }



  return (
    <div className='w-full h-full bg-gray-500/40 fixed inset-0 flex items-center justify-center z-1000 '>
      <div className='w-4/12 h-60 bg-white p-5 rounded'>
        <div className='flex items-center'>
          <button onClick={handleExit}><CloseIcon /></button>
          {isAdded && <p className='text-gray-500 ml-10'>{isAdded}<span className='text-red-500'>*</span></p>}
        </div>
        
        <h1  className='text-2xl mt-3 mb-3 '>Profile</h1>
      <div className='flex items-center'>{props.profile
        ?<img src={props.profile} alt="" className='w-30 h-30 rounded-full ml-2 border-1' />
        :<div className='ml-2'>
            <div className={`w-30 h-30 rounded-full flex items-center justify-center ${props.userColorClass}`}>
                <p className='text-3xl'>
                {props.firstName.slice(0,1).toUpperCase()}
                </p>
            </div>
        </div>}
        <div className='w-full flex flex-col m-3'>
          <p className='ml-1 mr-1 mb-2 text-2xl font-semibold'>{props.firstName} {props.surname}</p>
          <div>
            
            <p className='ml-1 mr-1 mb-1 text-sm'>username: {props.username}</p> 
            <p className='ml-1 mr-1 text-xs '>Id: {props.id} </p>
          </div>
          
        </div>
        <button className='w-70 bg-green-700 h-15 rounded-xl white text-white' onClick={handleSubmit}>{isContactAdded? 'Added': 'Add Contact'}</button>
      </div>
        
        

      </div> 
    </div>
  )
}
