import React, {useState , useEffect} from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
//components

import Logout from './Logout';

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
     <div className="h-screen w-1/5 bg-green-700 flex flex-col rounded-tr-xl rounded-br-xl">
      <div className="flex items-center w-full h-20 bg-green-800 border-b border-white p-4 rounded-tr-lg">
        <img src="../public/images/logo2.gif" alt="" className="h-12 mr-4" />
        <h1 className="text-2xl font-bold text-white">E-Kabuhayan</h1>
      </div>

      <nav className="flex flex-col mt-2 p-2 ">
        <Link to="/admin/dashboard" 
          className="flex w-full px-2 py-3 items-center gap-2 text-white font-semibold 
          hover:text-yellow-400 hover:bg-white rounded ">
          <DashboardIcon sx={{fontSize: 30}} /> Dashboard
        </Link>
         <Link to="/admin/statistics" 
          className="flex w-full px-2 py-3 items-center gap-2 text-white font-semibold 
          hover:text-yellow-400 hover:bg-white rounded ">
          <GroupsIcon sx={{fontSize: 30}} /> Master List
        </Link>
        <Link to="/admin/course" 
          className="flex w-full px-2 py-3 items-center gap-2 text-white font-semibold 
          hover:text-yellow-400 hover:bg-white rounded ">
          <GroupsIcon sx={{fontSize: 30}} /> Course
        </Link>
        <Link to="/admin/messages" 
          className="flex w-full px-2 py-3 items-center gap-2 text-white font-semibold 
          hover:text-yellow-400 hover:bg-white rounded ">
          <MessageIcon sx={{fontSize: 30}} /> Messages
        </Link>
        <Link to="/admin/createaccount" 
          className="flex w-full px-2 py-3 items-center gap-2 text-white font-semibold 
          hover:text-yellow-400 hover:bg-white rounded ">
          <PersonIcon sx={{fontSize: 30}} /> Create Account
        </Link>
      </nav>
      <Logout />
    </div>
  )
}
