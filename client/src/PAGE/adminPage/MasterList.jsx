import React from "react";
import Navbar from "./components/Navbar.jsx";
import StatisticsCollection from "./components/statistics/StatisticsCollection.jsx";
import ThemeToggle from "../../ThemeToggle"; // Adjust path as needed
import StorageIcon from '@mui/icons-material/Storage'; // Icon for Master List
import Profile from "./components/dashboard/Profile.jsx"; // Adjust path as needed

const MasterList = () => {
  // If you are fetching admin data for the profile bubble, add it here
  const dashboardData = {}; 

  return (
    <div className="flex w-screen h-screen bg-[#F8FAFC] dark:bg-slate-950 overflow-hidden font-sans text-slate-900 dark:text-slate-100 transition-colors duration-300">
      
      
      {/* SEAMLESS NAVBAR */}
      <Navbar />

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        
        {/* HEADER: Styled exactly like Trainer for consistency */}
        <header className="h-20 shrink-0 flex items-center justify-between px-10 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md border-b border-slate-200/60 dark:border-slate-800/60 sticky top-0 z-[50] transition-colors duration-300">
          <div className="flex items-center gap-4">
            <div className="p-2.5 bg-emerald-600 rounded-xl shadow-lg shadow-emerald-200 dark:shadow-emerald-900/20">
              <StorageIcon className="text-white w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-black text-slate-800 dark:text-slate-100 tracking-tight leading-tight uppercase">Master List</h1>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-none">Database Management</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <ThemeToggle />
            
          </div>
        </header>

        {/* SCROLLABLE CONTENT */}
        <main className="flex-1 overflow-y-auto px-10 py-8 custom-scrollbar">
          
          <div className="w-full w-full mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
            
            {/* MAIN DATA CARD */}
            <div className="rounded-[2.5rem] bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-white/40 dark:border-slate-800/60 p-10 shadow-2xl shadow-slate-200/50 dark:shadow-none">
              
              

              {/* Statistics & Tables */}
              <StatisticsCollection />
              
            </div>
          </div>

        </main>
      </div>
    </div>
  );
};

export default MasterList;