import React, {useState , useEffect} from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
//components
import Logout from "./Logout"


//icons
import DashboardIcon from '@mui/icons-material/Dashboard';
import GroupsIcon from '@mui/icons-material/Groups';
import MessageIcon from '@mui/icons-material/Message';
import PersonIcon from '@mui/icons-material/Person';

export default function Navrbar(props) {
  const [navigation, setNavigation] = useState("dashboard");
  const [viewData , setViewData] = useState(null)

  function handleNavigation(routes){
     console.log(routes)
    setNavigation(routes)
   
  }

  return (
     <div className="h-screen w-1/5 bg-green-700 flex flex-col">
      <div className="flex items-center w-full h-20 bg-green-800 border-b border-white p-4">
        <img src="../public/images/logo2.gif" alt="" className="h-12 mr-4" />
        <h1 className="text-2xl font-bold text-white">E-Kabuhayan</h1>
      </div>

      <nav className="flex flex-col gap-6 mt-6 px-4">
        <Link to="/trainer/dashboard" className="flex items-center gap-2 text-white font-semibold hover:text-green-200">
          <DashboardIcon /> Dashboard
        </Link>
        <Link to="/trainer/mybatch" className="flex items-center gap-2 text-white font-semibold hover:text-green-200">
          <GroupsIcon /> My Batch
        </Link>
        <Link to="/trainer/messages" className="flex items-center gap-2 text-white font-semibold hover:text-green-200">
          <MessageIcon /> Messages
        </Link>
        <Link to="/trainer/profile" className="flex items-center gap-2 text-white font-semibold hover:text-green-200">
          <PersonIcon /> Profile
        </Link>
      </nav>
      <Logout />
    </div>
    
  )
}
