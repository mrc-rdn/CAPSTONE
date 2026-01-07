import React,{useState, useEffect} from 'react'
import CloseIcon from '@mui/icons-material/Close';  
import { Link } from 'react-router-dom'
import { API_URL } from '../../api';
import axios from 'axios';
import EditUserInfo from './components/editprofile/EditUserInfo';
import UploadProfile from './components/editprofile/UploadProfile';
import Navrbar from './components/Navbar';

export default function EditProfile() {
    
    const [data, setData] = useState({})
    const [username, setUserName] = useState("")
    const [isProfileModal, setIsProfileModal] = useState(false)
    const [refresh, setRefresh] = useState(0)
    

    useEffect(()=>{
        const fetchData = async ()=>{
            const res = await axios.get(`${API_URL}/trainee/dashboard`, {withCredentials:true})
            let data = res.data.usersInfo
            console.log(data)
            setUserName(res.data.username)
            setData(data)
            
        }
        fetchData()
        
    },[refresh])
    const handleUploadProfile = async ()=>{
        setIsProfileModal(true)
    }
    const handleExitModal = ()=>{
        setIsProfileModal(false)
        setRefresh(prev => prev + 1)
    }
    

  return (
    <div className='flex'>
        <Navrbar />  
       <div className='w-full pt-10 px-20'>
            <EditUserInfo data={data} username={username} handleUploadProfile={handleUploadProfile} />
       </div>
       {isProfileModal?<UploadProfile onExit={handleExitModal} />:null}
    </div>
  )
}
