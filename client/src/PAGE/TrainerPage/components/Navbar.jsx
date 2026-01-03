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
    <div className="h-screen lg:w-1/5 bg-green-700 flex flex-col ">
      
      <div className='hidden lg:block'>
        <div className="flex items-center w-full h-20 bg-green-800 border-b border-white p-4">
          <img src="../public/images/logo2.gif" alt="" className="h-12 mr-4" />
          <h1 className="text-xl font-bold text-white">E-Kabuhayan</h1>
        </div>

        <nav className="flex flex-col gap-6 mt-6 px-4 ">
          <Link to="/trainer/dashboard" className="flex items-center gap-2 text-white font-semibold hover:text-green-200">
            <DashboardIcon sx={{fontSize: 35}} /> Dashboard
          </Link>
          <Link to="/trainer/course" className="flex items-center gap-2 text-white font-semibold hover:text-green-200">
            <GroupsIcon sx={{fontSize: 35}} /> Course
          </Link>
          <Link to="/trainer/messages" className="flex items-center gap-2 text-white font-semibold hover:text-green-200">
            <MessageIcon sx={{fontSize: 35}} /> Messages
          </Link>
          <Link to="/trainer/profile" className="flex items-center gap-2 text-white font-semibold hover:text-green-200">
            <PersonIcon sx={{fontSize: 35}} /> Profile
          </Link>
        </nav>
        <Logout />
      </div>
      
      <div className='block lg:hidden w-20 h-full'>
        <div className="flex items-center w-full h-20 bg-green-800 border-b border-white p-4">
          <img src="../public/images/logo2.gif" alt="" className="h-12 mr-4" />
          
        </div>

        <nav className="flex flex-col gap-6 mt-6 items-center ">
          <Link
            to="/trainer/dashboard"
            className="
              group
              relative
              flex items-center
              text-white font-semibold
            "
          >
            {/* ICON */}
            <DashboardIcon sx={{ fontSize: 35 }} />

            {/* SLIDE-IN TEXT */}
            <span
              className="w-30 h-16 absolute left-14 bg-green-700 text-white px-2  py-5 text-lg whitespace-nowrap font-semibold
              opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 ease-out pointer-events-none
              "
            >
              Dashboard
            </span>
          </Link>


          <Link to="/trainer/course" className="
              group
              relative
              flex items-center
              text-white font-semibold
            ">
            <GroupsIcon sx={{fontSize: 35}} />
            <span
              className="w-30 h-16 absolute left-14 bg-green-700 text-white px-2 py-5 text-lg whitespace-nowrap font-semibold
              opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 ease-out pointer-events-none
              "
            >
              Course
            </span>
          </Link>
          <Link to="/trainer/messages" className="group relative flex items-center text-white font-semibold
            ">
            <MessageIcon sx={{fontSize: 35}} />
            <span
              className="w-30 h-16 absolute left-14 bg-green-700 text-white px-2  py-5 text-lg whitespace-nowrap font-semibold
              opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 ease-out pointer-events-none
              "
            >
              Messages
            </span>
          </Link>
          <Link to="/trainer/profile" className="group relative flex items-center text-white font-semibold">
            <PersonIcon sx={{fontSize: 35}} />
            <span
              className="w-30  h-16 absolute left-14 bg-green-700 text-white px-2 py-5 text-lg whitespace-nowrap font-semibold
              opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 ease-out pointer-events-none
              "
            >
              Profile
            </span>
          </Link>
        </nav>
        <Logout />
      </div>
      
    </div>
    
  )
}
