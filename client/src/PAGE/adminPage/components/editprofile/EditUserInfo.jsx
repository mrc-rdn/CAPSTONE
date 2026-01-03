import React,{useState, useEffect} from 'react'
import { API_URL } from '../../../../api.js'
import axios from 'axios';

import { Link } from 'react-router-dom'

export default function EditUserInfo(props) {
    let data = props.data
    const [firstName , setFirstName] = useState('')
    const [surname, setSurname] = useState("");
    const [contactNo, setContactNo] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [picture, setPicture] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isMouseOver, setMouseOver] = useState(false)
    const [isMouseOver1, setMouseOver1] = useState(false)
    const [isUpdateProfile, setUpdateProfile] = useState(false)
    
    
    useEffect(() => {
        if (!props.data) return
        setFirstName(data.first_name ?? "")
        setSurname(data.surname ?? "")
        setContactNo(data.contact_no ?? "")
        setUsername(props.username ?? "")
        setPicture(data.profile_pic?? "")
    }, [props.data, props.username])

    const sendData = async (e)=>{
        e.preventDefault();
        if(password === confirmPassword){
            const res = await axios.post(`${API_URL}/admin/edituserinfo`, {firstName, surname, contactNo, password}, {withCredentials:true})
            console.log(res.data)
            return setUpdateProfile(res.data.success)
            
        }else{
            setPassword("")
            setConfirmPassword("")
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


    const userColorClass = colorMap[data.color]?.[data.shades] || 'bg-gray-500';
    
    
  return (
    <div className=' '>
        <p className='text-lg'>Edit Profile</p>
        <div 
            className='flex items-center flex-col m-3'
            onClick={()=> props.handleUploadProfile()}
        >

            {picture?<img src={picture} alt="" className='w-30 h-30 rounded-full m-3' />
            :<div className={`w-30 h-30 rounded-full flex text-3xl items-center justify-center m-3 ${userColorClass}`}>
                <p>
                {firstName.slice(0,1)}
                </p>
            </div>}

            
            <p>{firstName}</p>
        </div>
        {isUpdateProfile
        ?<p>Successful Updating Profile</p>
        :<form action="" className=' flex  flex-wrap '>
            <div className='flex-row flex w-full'>
                <div className='flex flex-col w-6/12 p-2'>
                    <label htmlFor="">First Name</label>
                    <input 
                    className=' w-full h-8 text-lg bg-green-500 rounded p-1 m-1'
                    type="text" 
                    name='first_name'
                    placeholder='FirstName'
                    onChange={(e)=>{setFirstName(e.target.value)}}
                    value={firstName}/>
                </div>
                
                <div className='flex-col w-6/12 p-2'>
                    <label htmlFor="">Surname</label>

                    <input 
                    className=' w-full h-8 text-lg bg-green-500 rounded p-1 m-1'
                    type="text" 
                    name='surname'
                    placeholder='Surname'
                    onChange={(e)=>{setSurname(e.target.value)}}
                    value={surname}/>

                </div>
                
            </div>
            
            <div className='p-2 w-full'>
                <label htmlFor="">Contact No</label>

                <input 
                className=' w-full h-8 text-lg bg-green-500 rounded p-1 my-2 mx-1 '
                type="text" 
                name='surname'
                placeholder='Contact No'
                onChange={(e)=>{setContactNo(e.target.value)}}
                value={contactNo}
                />

            </div>
            
            <div className='p-2 w-full'>
                <label htmlFor="">Username</label>
                <input 
                className=' w-full h-8 text-lg bg-green-500 rounded p-1 my-2 mx-1'
                type="text" 
                name="username" 
                placeholder='username'
                disabled
                value={username}/>

            </div>
            
            <div className='flex-row flex w-full'>
                <div className='flex flex-col w-6/12 p-2'>
                    <label htmlFor="">Password</label>
                    <input 
                    className=' w-full h-8 text-lg bg-green-500 rounded p-1 m-1'
                    type="text" 
                    name="Password"
                    placeholder='Password' 
                    required
                    onChange={(e)=>{setPassword(e.target.value)}}
                    value={password}/>
                </div>
                <div className='flex flex-col w-6/12 p-2'>
                    <label htmlFor="">Confirm Password</label>
                    <input 
                    className=' w-full h-8 text-lg bg-green-500 rounded p-1 m-1'
                    type="text" 
                    name="Password"
                    placeholder='Password' 
                    required
                    onChange={(e)=>{setConfirmPassword(e.target.value)}}
                    value={confirmPassword}/>
                </div>

            </div>
            
            
            <div className='w-full flex justify-center'>
               
                    <Link to='/admin/dashboard'>
                        <button 
                            className={isMouseOver?'m-3 w-30 h-10 text-sm text-white bg-green-500 rounded font-bold':'m-3 w-30 h-10 text-sm text-green-500 bg-white border-2 rounded' }
                            onMouseOver={()=> setMouseOver(true)}
                            onMouseOut={()=> setMouseOver(false)}>
                            Back To Home
                        </button>
                    </Link>
                
                <button 
                    className={isMouseOver1?'m-3 w-30 h-10 text-sm text-green-500 bg-white border-2 border-green-500 rounded ':'m-3 w-30 h-10 text-sm text-white bg-green-500 rounded font-bold' }
                    onMouseOver={()=> setMouseOver1(true)}
                    onMouseOut={()=> setMouseOver1(false)}
                    onClick={sendData}>
                    Save Changes
                </button>
            </div>
            
        </form>}
    </div>
  )
}
