import React,{useEffect, useState} from 'react'
import {Link, useNavigate} from "react-router-dom"
import '/public/styles.css'
import axios from "axios";

export default function TraineeLoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const Navigate = useNavigate();

  const customeStyle = {
    border: "1px solid black"
  }


  async function handleLogin (event){
    event.preventDefault();
    try {
      const res = await axios.post("http://localhost:3000/trainee/login", {
        username: username,
        password: password,
      }, { withCredentials: true })
      console.log(res.data)

      if(res.data.redirectTo){
        Navigate(res.data.redirectTo)
      }


    } catch (error) {
      console.log(error.message)
    }
  }

  return (
         <div className="w-full h-screen flex justify-center items-center">
              <div className='w-130 h-150 bg-green-700 flex flex-col items-center justify-center'>
                <h1 className='text-4xl mb-10 text-white'>Welcome Trainee</h1>
                <form action="" className=' flex flex-col '> 
                  <label className='mb-3'>Email</label>
                  <input 
                  type="text" 
                  onChange={(e)=>{ setUsername(e.target.value)}}
                  placeholder='✏️ Username' 
                  className='Email w-100 h-10 border-b-2 text-2xl focus:outline-none mb-5 '/>

                  <label className='mb-3'>password</label>
                  <input 
                  type="password" 
                  onChange={(e)=>{ setPassword(e.target.value)}}
                  placeholder='🔒 Password' 
                  className='Email w-100 h-10 border-b-2 text-2xl focus:outline-none mb-5'/>

                  <button 
                  onClick={handleLogin}
                  className='w-100 h-10 bg-white font-bold mb-5'>
                  Login
                  </button>

                </form>
                <button><Link to="/">Back</Link></button>
              </div>
              
            </div>
  )
}
