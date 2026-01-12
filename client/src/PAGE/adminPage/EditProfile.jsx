import React,{useState, useEffect} from 'react'
import CloseIcon from '@mui/icons-material/Close';  
import { Link } from 'react-router-dom'
import { API_URL } from '../../api';
import axios from 'axios';
import EditUserInfo from './components/editprofile/EditUserInfo';
import UploadProfile from './components/editprofile/UploadProfile';
import Navbar from './components/Navbar';

export default function EditProfile() {
    
    const [data, setData] = useState({})
    const [username, setUserName] = useState("")
    const [isProfileModal, setIsProfileModal] = useState(false)
    const [refresh, setRefresh] = useState(0)

    useEffect(()=>{
        const fetchData = async ()=>{
            const res = await axios.get(`${API_URL}/admin/dashboard`, {withCredentials:true})
            let data = res.data.usersInfo
            setUserName(res.data.username)
            setData(data)
        }
        fetchData()
    },[refresh])

    const handleUploadProfile = ()=>{
        setIsProfileModal(true)
    }

    const handleExitModal = ()=>{
        setIsProfileModal(false)
        setRefresh(prev => prev + 1)
    }

  return (
    <div className="relative flex w-screen h-screen overflow-hidden">
      
      {/* BACKGROUND IMAGE */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <img
          src="/images/plmro.jpg"
          alt="Dashboard background"
          className="w-full h-full object-cover scale-105"
        />
        <div className="absolute inset-0 bg-white/10" />
      </div>

      {/* NAVBAR */}
      <Navbar />

      {/* MAIN CONTENT */}
      <div className="w-full flex justify-center items-start pt-10">
        
        {/* GLASS CONTAINER */}
        <div className="w-full max-w-5xl rounded-2xl bg-white/20 backdrop-blur-xl border border-white/30 shadow-xl p-8">
          
          <EditUserInfo
            data={data}
            username={username}
            handleUploadProfile={handleUploadProfile}
          />

        </div>
      </div>

      {/* MODAL */}
      {isProfileModal && (
        <UploadProfile onExit={handleExitModal} />
      )}

    </div>
  )
}