import React, {useEffect, useState} from 'react'
import {Link, Navigate} from 'react-router-dom'
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
import { API_URL } from '../../../../api.js';


export default function AddChapterModal(props) {
    const exit = false
    const [id, setId] = useState("");
    const [isContactAdded, setIsContactAdded] = useState(false)
    const [isAdded, setIsAdded] = useState("")
  
    const [isMouseOver, setMouseOver] = useState(false)
 
    const handleSubmit = async(e) =>{
      e.preventDefault();
      try {
        const addNewContacts = await axios.post(`${API_URL}/admin/addContact`,{user2_id: id }, {withCredentials:true})
        let message = addNewContacts.data.message
        setIsContactAdded(true)
        setIsAdded(message)
      } catch (error) {
        console.log('error adding contacts', error)
      }
    }



  return (
    <div className='w-full h-full bg-gray-500/40 fixed inset-0 flex items-center justify-center z-1000 '>
      <div className='w-130 h-90 bg-white p-3 rounded'>

        <button onClick={()=>{props.onExit(exit);}}><CloseIcon /></button>
        <h1  className='text-2xl mt-3 mb-3 '>Add Chat</h1>
       {isContactAdded
       ?<h1>Chats added</h1>
       :<form  
        className='flex flex-col items-center'>
          <div className='w-10/12 flex flex-col m-3'>
            <label >Identification</label>
            <input 
            className='w-full h-10 text-2xl bg-green-500 rounded p-1'
            onChange={(e)=>{setId(e.target.value) }}
            type="text" 
            maxLength="25"
            required
            placeholder='User Id'
            value={id} />
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
