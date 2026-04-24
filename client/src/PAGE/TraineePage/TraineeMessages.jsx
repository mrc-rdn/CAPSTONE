import React, { useEffect, useState } from "react";
import Navbar from "./components/Navbar.jsx";
import Header from "./components/message/Header.jsx";
import ContactList from "./components/message/ContactList.jsx";
import axios from "axios";
import { API_URL } from "../../api.js";
import { io } from "socket.io-client";
import ForumIcon from '@mui/icons-material/Forum';
import ThemeToggle from '../../ThemeToggle';
import { motion, AnimatePresence } from "framer-motion";

// Unified Socket Instance
const socket = io(API_URL, {
  withCredentials: true,
  autoConnect: false,
});

export default function AdminMessages() {
  const [userData, setUserData] = useState({});
  const [refresh, setRefresh] = useState(0);

  const handleRefresh = () => {
    setRefresh((prev) => prev + 1);
  };

  // Fetch Trainee Specific Data
  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await axios.get(`${API_URL}/trainee/dashboard`, {
          withCredentials: true,
        });
        setUserData(res.data.usersInfo);
      } catch (err) {
        console.error("Error fetching trainee data:", err);
      }
    }
    fetchUser();
  }, []);

  // Socket Connection Management
  useEffect(() => {
    if (!userData?.id) return;

    socket.connect();
    socket.emit("join-user", userData.id);

    socket.on("connect", () => {
      console.log("Trainee Socket connected:", socket.id);
    });

    return () => {
      socket.disconnect();
    };
  }, [userData?.id]);

  return (
    <div className="flex w-screen h-screen bg-[#F8FAFC] dark:bg-slate-950 overflow-hidden font-sans text-slate-900 dark:text-slate-100 transition-colors duration-500">
      
      {/* 1. LAYERED BACKGROUND DEPTH */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <img
          src="/images/plmro.jpg"
          alt="Dashboard background"
          className="w-full h-full object-cover opacity-[0.05] dark:opacity-[0.03] grayscale transition-opacity duration-1000"
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-slate-100/80 via-transparent to-emerald-50/30 dark:from-slate-950 dark:via-slate-950/80 dark:to-emerald-950/20" />
      </div>

      {/* SEAMLESS NAVBAR */}
      <Navbar />

      <div className="flex-1 flex flex-col relative overflow-hidden">
        
        {/* 2. MODERN HEADER */}
        <header className="h-20 shrink-0 flex items-center justify-between px-10 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl border-b border-slate-200/60 dark:border-slate-800/60 sticky top-0 z-[50] transition-all duration-300">
          <div className="flex items-center gap-4">
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="p-2.5 bg-[#2D4F2B] rounded-xl shadow-lg shadow-[#2D4F2B]/20"
            >
              <ForumIcon className="text-white w-5 h-5" />
            </motion.div>
            <div>
              <h1 className="text-lg font-black text-slate-800 dark:text-slate-100 tracking-tight leading-tight uppercase">Messages</h1>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-none">Real-time Connection</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <ThemeToggle />
            <Header title="message" refresh={handleRefresh} />
          </div>
        </header>

        {/* 3. CHAT CONTENT CONTAINER */}
        <main className="flex-1 overflow-hidden p-6 lg:p-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="h-full max-w-[1600px] mx-auto bg-white/70 dark:bg-slate-900/70 backdrop-blur-2xl rounded-[3rem] border border-slate-200/60 dark:border-slate-800/60 shadow-2xl shadow-slate-200/50 dark:shadow-none overflow-hidden flex flex-col transition-all duration-300"
          >
            <div className="flex-1 overflow-hidden">
               <ContactList 
                userData={userData} 
                socket={socket} 
                handlerefresh={refresh} // Matched to Trainer's expected prop name
              />
            </div>
          </motion.div>
        </main>

      </div>
    </div>
  );
}