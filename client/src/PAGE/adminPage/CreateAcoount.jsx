import React, { useState } from 'react';
import Navbar from './components/Navbar';
import CAContent from './components/CAContent';
import ThemeToggle from '../../ThemeToggle'; // Adjust path if needed
import PersonAddIcon from '@mui/icons-material/PersonAdd'; // Better icon for "Create Account"

export default function CreateAccount() {
  // Add any logic/state here if needed later
  // If you need the Profile data for the header, you'd fetch it here like in Trainer
  const [dashboardData, setDashboardData] = useState({}); 

  return (
    <div className="flex w-screen h-screen bg-[#F8FAFC] dark:bg-slate-950 overflow-hidden font-sans text-slate-900 dark:text-slate-100 transition-colors duration-300">
      
      {/* GLOBAL BACKGROUND - Copied from Trainer */}
      <div className="absolute inset-0 -z-10 overflow-hidden opacity-10 dark:opacity-[0.02]">
        <img
          src="/images/plmro.jpg"
          alt="Dashboard background"
          className="w-full h-full object-cover scale-105 grayscale"
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-slate-100/50 via-transparent to-emerald-50/30 dark:from-slate-900/50 dark:to-emerald-900/20" />
      </div>

      {/* SEAMLESS NAVBAR */}
      <Navbar />

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        
        {/* HEADER: Styled exactly like Trainer */}
        <header className="h-20 shrink-0 flex items-center justify-between px-10 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md border-b border-slate-200/60 dark:border-slate-800/60 sticky top-0 z-[50] transition-colors duration-300">
          <div className="flex items-center gap-4">
            <div className="p-2.5 bg-emerald-600 rounded-xl shadow-lg shadow-emerald-200 dark:shadow-emerald-900/20">
              <PersonAddIcon className="text-white w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-black text-slate-800 dark:text-slate-100 tracking-tight leading-tight uppercase">Admin Panel</h1>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-none">Create Account</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <ThemeToggle />
            {/* If Admin doesn't need the Profile bubble, you can remove this line */}
            
          </div>
        </header>

        {/* SCROLLABLE CONTENT */}
        <main className="flex-1 overflow-y-auto px-10 py-8 custom-scrollbar">
          
          {/* CONTENT WRAPPER - Animates your existing CAContent */}
          <div className="w-full max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
              <CAContent />
          </div>

        </main>
      </div>
    </div>
  );
}