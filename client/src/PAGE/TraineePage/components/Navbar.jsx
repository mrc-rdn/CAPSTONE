import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import Logout from './Logout';
import DashboardIcon from '@mui/icons-material/Dashboard';
import GroupsIcon from '@mui/icons-material/Groups';
import MessageIcon from '@mui/icons-material/Message';
import PersonIcon from '@mui/icons-material/Person';
import MenuIcon from '@mui/icons-material/Menu';

export default function Navrbar(props) {
  const [navigation, setNavigation] = useState("dashboard");
  const [viewData, setViewData] = useState(null)
  const [isOpenChapters, setIsOpenChapters] = useState(false)

  function handleNavigation(routes) {
    console.log(routes)
    setNavigation(routes)

  }

  const handleOpenChapters = () => {

  }

  return (
    <div
      className="
    h-[96%]
    w-1/5
    m-4
    flex flex-col
    rounded-2xl
    bg-white/10
    backdrop-blur-md
    border border-white/20
    shadow-xl
  "
    >
      {/* HEADER */}
      <div
        className="
      flex items-center
      w-full h-20
      bg-white/5
      backdrop-blur-md
      border-b border-white/5
      px-4
      rounded-t-2xl
    "
      >
        <img src="/images/logo2.gif" alt="" className="h-12 mr-4" />
        <h1 className="text-2xl font-bold text-[#708A58]">
          <span className="text-[#2D4F2B]">E</span>-Kabuhayan
        </h1>

      </div>

      {/* NAV */}
      <nav className="flex flex-col mt-3 px-2 gap-1">
        <Link
          to="/trainee/dashboard"
          className="
        flex items-center gap-2
        px-3 py-3
        rounded-xl
        text-[#2D4F2B] font-semibold
        hover:bg-white/20
        hover:text-yellow-400
        transition
      "
        >
          <DashboardIcon sx={{ fontSize: 30 }} /> Dashboard
        </Link>

        <Link
          to="/trainee/course"
          className="
        flex items-center gap-2
        px-3 py-3
        rounded-xl
        text-[#2D4F2B] font-semibold
        hover:bg-white/20
        hover:text-yellow-400
        transition
      "
        >
          <GroupsIcon sx={{ fontSize: 30 }} /> Course
        </Link>
        

        <Link
          to="/trainee/messages"
          className="
        flex items-center gap-2
        px-3 py-3
        rounded-xl
        text-[#2D4F2B] font-semibold
        hover:bg-white/20
        hover:text-yellow-400
        transition
      "
        >
          <MessageIcon sx={{ fontSize: 30 }} /> Messages
        </Link>

        
      </nav>

      <div className="mt-auto px-2 pb-4">
        <Logout />
      </div>
    </div>

  )
}