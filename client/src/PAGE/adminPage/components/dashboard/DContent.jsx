import React, { useState, useEffect } from 'react';
import SchoolIcon from '@mui/icons-material/School';
import BarChartIcon from '@mui/icons-material/BarChart';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import PeopleIcon from '@mui/icons-material/People';

export default function Content(props) {
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) setGreeting("Good Morning");
    else if (hour >= 12 && hour < 17) setGreeting("Good Afternoon");
    else if (hour >= 17 && hour < 21) setGreeting("Good Evening");
    else setGreeting("Good Night");
  }, []);

  return (
    <div className="w-full grid grid-cols-12 gap-8">
      {/* Welcome Banner */}
      <div className="col-span-12 xl:col-span-12 h-56 rounded-[2.5rem] bg-gradient-to-br from-[#2D4F2B] to-[#1e3a1c] p-10 flex flex-col justify-center relative overflow-hidden shadow-2xl shadow-[#2D4F2B]/20">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#FFB823]/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl"></div>
        
        <div className="relative z-10">
          <h1 className="text-3xl font-black text-white mb-2">{greeting}, Administrator!</h1>
          <p className="text-[#F1F3E0]/80 font-medium max-w-xl">
            You are overseeing <span className="text-[#FFB823] font-black">{props.trainerCount + props.traineeCount} registered users</span> across <span className="text-[#FFB823] font-black">{props.coursesCount} active courses</span> in the E-Kabuhayan ecosystem.
          </p>
        </div>
      </div>

      {/* Stat Cards Grid */}
      <div className="col-span-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        
        {/* Trainees Stat */}
        <div className="h-56 rounded-[2.5rem] bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 p-8 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] flex flex-col justify-between group hover:-translate-y-1 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div className="w-14 h-14 bg-emerald-50 dark:bg-emerald-950/20 rounded-2xl flex items-center justify-center border border-emerald-100 dark:border-emerald-900/30 group-hover:bg-[#2D4F2B] group-hover:text-white transition-all duration-300 text-[#2D4F2B] dark:text-emerald-400 group-hover:dark:text-white">
              <SchoolIcon />
            </div>
            <span className="text-[10px] font-black text-[#2D4F2B] dark:text-emerald-400 uppercase tracking-widest bg-emerald-50 dark:bg-emerald-950/30 px-3 py-1 rounded-full border border-emerald-100 dark:border-emerald-900/30">Trainees</span>
          </div>
          <div>
            <p className="text-4xl font-black text-slate-800 dark:text-slate-100 leading-none mb-2">{props.traineeCount}</p>
            <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Total Enrolled</p>
          </div>
        </div>

        {/* Trainers Stat */}
        <div className="h-56 rounded-[2.5rem] bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 p-8 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] flex flex-col justify-between group hover:-translate-y-1 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div className="w-14 h-14 bg-blue-50 dark:bg-blue-950/20 rounded-2xl flex items-center justify-center border border-blue-100 dark:border-blue-900/30 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 text-blue-600 dark:text-blue-400 group-hover:dark:text-white">
              <BarChartIcon />
            </div>
            <span className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest bg-blue-50 dark:bg-blue-950/30 px-3 py-1 rounded-full border border-blue-100 dark:border-blue-900/30">Trainers</span>
          </div>
          <div>
            <p className="text-4xl font-black text-slate-800 dark:text-slate-100 leading-none mb-2">{props.trainerCount}</p>
            <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Certified Instructors</p>
          </div>
        </div>

        {/* Total Users Stat */}
        <div className="h-56 rounded-[2.5rem] bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 p-8 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] flex flex-col justify-between group hover:-translate-y-1 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div className="w-14 h-14 bg-purple-50 dark:bg-purple-950/20 rounded-2xl flex items-center justify-center border border-purple-100 dark:border-purple-900/30 group-hover:bg-purple-600 group-hover:text-white transition-all duration-300 text-purple-600 dark:text-purple-400 group-hover:dark:text-white">
              <PeopleIcon />
            </div>
            <span className="text-[10px] font-black text-purple-600 dark:text-purple-400 uppercase tracking-widest bg-purple-50 dark:bg-purple-950/30 px-3 py-1 rounded-full border border-purple-100 dark:border-purple-900/30">System</span>
          </div>
          <div>
            <p className="text-4xl font-black text-slate-800 dark:text-slate-100 leading-none mb-2">{props.trainerCount + props.traineeCount}</p>
            <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Total Active Users</p>
          </div>
        </div>

        {/* Courses Stat */}
        <div className="h-56 rounded-[2.5rem] bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 p-8 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] flex flex-col justify-between group hover:-translate-y-1 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div className="w-14 h-14 bg-amber-50 dark:bg-amber-950/20 rounded-2xl flex items-center justify-center border border-amber-100 dark:border-amber-900/30 group-hover:bg-amber-500 group-hover:text-white transition-all duration-300 text-amber-600 dark:text-amber-400 group-hover:dark:text-white">
              <MenuBookIcon />
            </div>
            <span className="text-[10px] font-black text-amber-600 dark:text-amber-400 uppercase tracking-widest bg-amber-50 dark:bg-amber-950/30 px-3 py-1 rounded-full border border-amber-100 dark:border-amber-900/30">Programs</span>
          </div>
          <div>
            <p className="text-4xl font-black text-slate-800 dark:text-slate-100 leading-none mb-2">{props.coursesCount}</p>
            <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Active Subjects</p>
          </div>
        </div>

      </div>
    </div>
  );
}