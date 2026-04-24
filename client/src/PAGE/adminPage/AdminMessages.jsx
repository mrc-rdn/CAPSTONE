import React, { useEffect, useState } from 'react'
import Navbar from './components/Navbar.jsx'
import Header from './components/message/Header.jsx'
import ContactList from './components/message/ContactList.jsx'
import axios from 'axios'
import { API_URL } from '../../api.js'
import { io } from "socket.io-client";
import ForumIcon from '@mui/icons-material/Forum';
import ThemeToggle from '../../ThemeToggle'; // Added ThemeToggle import

const socket = io(API_URL, {
  withCredentials: true,
  autoConnect: false
});

export default function AdminMessages() {
  const [userData, setUserData] = useState([])
  const [refresh, setRefresh] = useState(0)

  function handlerefresh() {
    setRefresh(prev => prev + 1)
  }

  useEffect(() => {
    async function fetchData() {
      try {
        // Keeps the admin-specific endpoint
        const response = await axios.get(`${API_URL}/admin/dashboard`, { withCredentials: true });
        setUserData(response.data.usersInfo)
      } catch (error) {
        console.log(error)
      }
    }
    fetchData()
  }, [])

  useEffect(() => {
    socket.connect();
    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
    });
    return () => socket.disconnect();
  }, []);

  return (
    <div className="flex w-screen h-screen bg-[#F8FAFC] dark:bg-slate-950 overflow-hidden font-sans text-slate-900 dark:text-slate-100 transition-colors duration-300">
      
      {/* 1. LAYERED BACKGROUND DEPTH (Dark mode support added) */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <img
          src="/images/plmro.jpg"
          alt="Dashboard background"
          className="w-full h-full object-cover opacity-[0.04] dark:opacity-[0.02] grayscale"
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-slate-100/60 via-transparent to-emerald-50/20 dark:from-slate-900/50 dark:to-emerald-900/20" />
      </div>

      {/* SEAMLESS NAVBAR */}
      <Navbar />

      <div className="flex-1 flex flex-col relative overflow-hidden">
        
        {/* 2. SHARED MODERN HEADER (Dark mode and ThemeToggle added) */}
        <header className="h-20 shrink-0 flex items-center justify-between px-10 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md border-b border-slate-200/60 dark:border-slate-800/60 sticky top-0 z-[50] transition-colors duration-300">
          <div className="flex items-center gap-4">
            <div className="p-2.5 bg-indigo-600 rounded-xl shadow-lg shadow-indigo-200 dark:shadow-indigo-900/20">
              <ForumIcon className="text-white w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-black text-slate-800 dark:text-slate-100 tracking-tight leading-tight uppercase">Communications</h1>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-none">Real-time Connection</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <ThemeToggle />
            <Header refresh={handlerefresh} />
          </div>
        </header>

        {/* 3. CHAT CONTENT CONTAINER (Glassmorphism Dark styles added) */}
        <main className="flex-1 overflow-hidden p-6 lg:p-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="h-full max-w-[1600px] mx-auto bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-[3rem] border border-slate-200/60 dark:border-slate-800/60 shadow-2xl shadow-slate-200/50 dark:shadow-none overflow-hidden flex flex-col transition-colors duration-300">
            
            <div className="flex-1 overflow-hidden">
               <ContactList 
                userData={userData} 
                socket={socket} 
                handlerefresh={refresh} 
              />
            </div>

          </div>
        </main>

      </div>
    </div>
  )
}