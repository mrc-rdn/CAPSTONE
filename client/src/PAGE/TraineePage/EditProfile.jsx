import React, { useState, useEffect } from 'react';
import { API_URL } from '../../api';
import axios from 'axios';
import EditUserInfo from './components/editprofile/EditUserInfo';
import UploadProfile from './components/editprofile/UploadProfile';
import Navbar from './components/Navbar';
import ThemeToggle from '../../ThemeToggle';
import SettingsIcon from '@mui/icons-material/Settings';
import Profile from './components/dashboard/Profile.jsx'; // Ensure path is correct

export default function EditProfile() {
  const [data, setData] = useState({});
  const [dashboardData, setDashboardData] = useState({}); // Matches Trainer logic
  const [username, setUserName] = useState("");
  const [isProfileModal, setIsProfileModal] = useState(false);
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${API_URL}/trainee/dashboard`, { withCredentials: true });
        let userData = res.data.usersInfo;
        setDashboardData(res.data);
        setUserName(res.data.username);
        setData(userData);
      } catch (err) {
        console.error("Error fetching profile data:", err);
      }
    };
    fetchData();
  }, [refresh]);

  const handleUploadProfile = () => {
    setIsProfileModal(true);
  };

  const handleExitModal = () => {
    setIsProfileModal(false);
    setRefresh(prev => prev + 1);
  };

  // Trainee uses a dark green brand color (#2D4F2B)
  const colorMap = {
    red: { 500: 'bg-red-500' }, yellow: { 500: 'bg-yellow-500' },
    green: { 500: 'bg-emerald-500' }, orange: { 500: 'bg-orange-500' },
    blue: { 500: 'bg-blue-500' }, purple: { 500: 'bg-purple-500' },
    pink: { 500: 'bg-pink-500' },
  }
  const userColorClass = colorMap[dashboardData.color]?.[dashboardData.shade] || 'bg-slate-500';

  return (
    <div className="flex w-screen h-screen bg-[#F8FAFC] dark:bg-slate-950 overflow-hidden font-sans text-slate-900 dark:text-slate-100 transition-colors duration-300">
      
      {/* GLOBAL BACKGROUND - Thematic Overlay */}
      <div className="absolute inset-0 -z-10 overflow-hidden opacity-10 dark:opacity-[0.02]">
        <img
          src="/images/plmro.jpg"
          alt="Dashboard background"
          className="w-full h-full object-cover scale-105 grayscale"
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-slate-100/50 via-transparent to-[#2D4F2B]/10 dark:from-slate-900/50 dark:to-[#2D4F2B]/5" />
      </div>

      {/* SEAMLESS NAVBAR */}
      <Navbar />

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        
        {/* HEADER: Shared style from Trainer Dashboard */}
        <header className="h-20 shrink-0 flex items-center justify-between px-10 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md border-b border-slate-200/60 dark:border-slate-800/60 sticky top-0 z-[50] transition-colors duration-300">
          <div className="flex items-center gap-4">
            {/* Trainee Brand Color Icon Box */}
            <div className="p-2.5 bg-[#2D4F2B] rounded-xl shadow-lg shadow-[#2D4F2B]/20">
              <SettingsIcon className="text-white w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-black text-slate-800 dark:text-slate-100 tracking-tight leading-tight uppercase">Settings</h1>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2D4F2B]"></span>
                <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-none">Trainee Profile Management</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <ThemeToggle />
            <Profile data={dashboardData} userColorClass={userColorClass} />
          </div>
        </header>

        {/* SCROLLABLE CONTENT */}
        <main className="flex-1 overflow-y-auto px-10 py-8 custom-scrollbar">
          
          <div className="w-full max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
              <EditUserInfo
                data={data}
                username={username}
                handleUploadProfile={handleUploadProfile}
              />
          </div>

        </main>
      </div>

      {/* MODAL OVERLAY */}
      {isProfileModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg animate-in fade-in zoom-in duration-300">
             <UploadProfile onExit={handleExitModal} />
          </div>
        </div>
      )}

    </div>
  );
}