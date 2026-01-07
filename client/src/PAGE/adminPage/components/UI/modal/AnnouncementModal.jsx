import React, {useEffect, useState, useRef} from 'react'
import {Link, Navigate} from 'react-router-dom'
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
import { API_URL } from '../../../../../api.js';
import DeleteIcon from '@mui/icons-material/Delete';

export default function AddChapterModal(props) {
    const exit = false
    const [title, setTitle] = useState("");
    const [message, setMessage] = useState("");
    const [isMouseOver, setMouseOver] = useState(false)

    const [isTextArea, setIsTextArea] = useState(false)
    const textareaRef = useRef(null);
   
    const [announcement, setAnnouncement] = useState([]);
    const [refresh, setRefresh] = useState(0)
    const [userId, setUserId] = useState("")

    useEffect(() => {
      const fectchdata = async()=>{
          const [fetch, user] = await Promise.all([axios.get(`${API_URL}/admin/announcement/${props.courseId}`, {withCredentials:true}),
            axios.get(`${API_URL}/admin/dashboard`, {withCredentials:true}),])
          setAnnouncement(fetch.data)
          console.log(fetch.data)
          setUserId(user.data.usersInfo.id)
          
      }
      fectchdata()
        

    }, [props.courseId, refresh]);

    const handleChange = (e) => {
      setMessage(e.target.value);

      const el = textareaRef.current;
      el.style.height = "auto"; // reset
      el.style.height = el.scrollHeight + "px"; // auto grow
    };

    const handleSubmit = async(e)=>{
      e.preventDefault()
      try {
        const postannounce = await axios.post(`${API_URL}/admin/announcement`, 
          {courseId: props.courseId, title:title, message:message },
          {withCredentials:true})
          setRefresh(prev => prev +1)
          setTitle("")
          setMessage("")
      } catch (error) {
        console.log(error)
      }
      
    }
    const handleDelete = async (id)=>{
      try {
        const res = await axios.delete(
          `${API_URL}/admin/announcement/delete/${id}`,
          { withCredentials: true }
        );
        setRefresh(prev => prev +1)
        console.log(res.data);
      } catch (error) {
        console.error(error);
      }
    }

    const colorMap = {
    red: {200: 'bg-red-200',300: 'bg-red-300',400: 'bg-red-400',500: 'bg-red-500',600: 'bg-red-600',700: 'bg-red-700', 800: 'bg-red-800'},
    yellow: {200: 'bg-yellow-200',300: 'bg-yellow-300',400: 'bg-yellow-400',500: 'bg-yellow-500',600: 'bg-yellow-600',700: 'bg-yellow-700',800: 'bg-yellow-800'},
    green: {200: 'bg-green-200',300: 'bg-green-300',400: 'bg-green-400',500: 'bg-green-500',600: 'bg-green-600',700: 'bg-green-700',800: 'bg-green-800'},
    orange: {200: 'bg-orange-200',300: 'bg-orange-300',400: 'bg-orange-400',500: 'bg-orange-500',600: 'bg-orange-600',700: 'bg-orange-700',800: 'bg-orange-800'},
    blue: {200: 'bg-blue-200',300: 'bg-blue-300',400: 'bg-blue-400',500: 'bg-blue-500',600: 'bg-blue-600',700: 'bg-blue-700',800: 'bg-blue-800'},
    purple: {200: 'bg-purple-200',300: 'bg-purple-300',400: 'bg-purple-400',500: 'bg-purple-500',600: 'bg-purple-600',700: 'bg-purple-700',800: 'bg-purple-800'},
    pink: {200: 'bg-pink-200',300: 'bg-pink-300',400: 'bg-pink-400',500: 'bg-pink-500',600: 'bg-pink-600',700: 'bg-pink-700',800: 'bg-pink-800'},
  }

    
    



  return (
    <div className='w-full h-full bg-gray-500/40 fixed inset-0 flex items-center justify-center z-100 '>
      <div className='w-full h-full bg-gray-100 p-3 rounded flex flex-col'>

        <div>
          <button onClick={()=>{props.onExit(exit);}}><CloseIcon /></button>
        </div>
        <div className='w-full flex items-center'>

       
        <h1  className='text-2xl mt-3 ml-6'>Announcement</h1>
        
        <button 
          className='w-55 h-12 bg-green-500 rounded text-white font-bold ml-auto'
          onClick={()=> setIsTextArea(true)}>Create Announcement
        </button>
        
        
        </div>
        {isTextArea&&<div className='w-full h-full bg-gray-500/40 z-1000 absolute inset-0'>
        <div className='w-full h-full flex items-center justify-center'>
          <form  onSubmit={handleSubmit}
        className='flex flex-col items-center h-7/12 my-auto bg-white w-6/12 rounded-lg'>
          <div className='w-full'>
            <button className='m-5' onClick={()=>{setIsTextArea(false);}}><CloseIcon /></button>
            <h1 className='ml-9'>Create Announcement</h1>
          </div>
           
          <div className='w-10/12 flex flex-col m-2'>
            <label >Title</label>
            <input 
            className='w-full h-9 m-2 bg-green-500 rounded p-1'
            onChange={(e)=>{setTitle(e.target.value) }}
            type="text" 
            maxLength="25"
            required
            placeholder='Title'
            value={title} />
          </div>
            
          <div className='w-10/12 flex flex-col mb-10 '>
            <label>Message</label>
            <div className='flex items-center'>
              <textarea 
              ref={textareaRef}
              className=' w-full bg-green-500 rounded p-1 h-8 max-h-[140px] overflow-y-scroll m-2'
              onChange={handleChange}
              type="text" 
              maxLength='480'
              required
              placeholder='Message' 
              value={message}/>
              <button
                className={isMouseOver?'m-3 w-30 h-10 text-2xl text-white bg-green-500 rounded':'m-3 w-30 h-10 text-2xl text-green-500 bg-white border-2  rounded' }
                onMouseOver={()=> setMouseOver(true)}
                onMouseOut={()=> setMouseOver(false)}
                type='submit'>
                  Send
              </button>
          

            </div>
          
            
          
          </div>
                                

            
        </form></div>
        </div>
        }
       
       <div className='w-full h-full '>

        
        <div className='h-9/12 overflow-y-scroll mt-5 w-full'>

        
         {
            announcement.map((item, index)=>{
              return <div key={index} className="w-10/12 h-6/12 mx-auto my-4 p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition">
                        <div className='flex items-center'>
                          {item.profile_pic
                          ?<img src={item.profile_pic} alt="" className='w-11 h-11 rounded-full ml-2 border-1' />
                          :<div className='ml-2'>
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${colorMap[item.color]?.[item.shades]|| 'bg-gray-500'} `}>
                                  <p>
                                  {item && item.first_name.slice(0,1)}
                                  </p>
                              </div>
                          </div>}
                          <p className='m-2'>{item.first_name}</p>
                          <p>{item.surname}</p>
                          {
                            userId === item.user_id && <button className='ml-auto' onClick={()=>handleDelete(item.id)}><DeleteIcon /></button>
                          }
                          
                        </div>
                        <h2 className="text-xl font-bold text-gray-800 mb-2 m-3">{item.title}</h2>
                        <p className="text-gray-600 break-words">{item.message}</p>
                      </div>
            })
          }
          </div>
       
       
      
        </div>
        

      </div> 
    </div>
  )
}
