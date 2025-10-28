import React, {useState} from 'react'
import {Link , useNavigate} from "react-router-dom"
import '/public/styles.css'
import axios from "axios"

const API_URL = "http://localhost:3000/trainer/login"

export default function TrainerLoginPage() {
  const [email , setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] =useState("")
  const Navigate = useNavigate();
 


  async function handleLogin(event){
    event.preventDefault();
    try {
      const response = await axios.post(API_URL, {
        username: email, 
        password: password,
      }, { withCredentials: true })

      if(response.data.redirectTo){
        Navigate(response.data.redirectTo)
      }
      
      
    } catch (err) {
      console.log("error handling login in trainer side page",err)
    }

  }

  return (
    <div className="w-full h-screen flex justify-center items-center">
      <div className='w-130 h-150 bg-green-700 flex flex-col items-center justify-center'>
        <p>{error}</p>
        <h1 className='text-4xl mb-10 text-white'>Welcome Trainer</h1>

        <form action="" className=' flex flex-col '> 
          <label className='mb-3 text-white'>Email</label>
          <input 
          onChange={(e)=>{setEmail(e.target.value)}}
          type="text" 
          placeholder='✏️ Username' 
          value={email}
          className='Email w-100 h-10 border-b-2 text-2xl focus:outline-none mb-5 '/>

          <label className='mb-3 text-white'>password</label>
          <input 
          onChange={(e)=>{setPassword(e.target.value)}}
          type="password" 
          placeholder='🔒 Password' 
          value={password}
          className='Email w-100 h-10 border-b-2  text-2xl focus:outline-none mb-5'/>

          <button 
          onClick={handleLogin} 
          className='w-100 h-10 font-bold mb-5 border-green-400 border-2 text-white'>
          Login
          </button>
        </form>

        <button><Link to="/">Back</Link></button>
      </div>
      
    </div>
  )
}
