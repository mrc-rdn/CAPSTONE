import React,{useState, useEffect} from 'react'
import SchoolIcon from '@mui/icons-material/School';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import BarChartIcon from '@mui/icons-material/BarChart';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import PeopleIcon from '@mui/icons-material/People';


export default function Content(props) {
  const [greeting, setGreeting] = useState("")
 
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) setGreeting("Good Morning");
    else if (hour >= 12 && hour < 17) setGreeting("Good Afternoon");
    else if (hour >= 17 && hour < 21) setGreeting("Good Evening");
    else setGreeting("Good Night");
  }, [])

  return (
    <div className="w-full grid grid-cols-12 gap-8">
      {/* Welcome Banner */}
      <div className="col-span-12 xl:col-span-6 h-56 rounded-[2.5rem] bg-gradient-to-br from-brand-green to-[#1e3a1c] p-10 flex flex-col justify-center relative overflow-hidden shadow-2xl shadow-brand-green/20">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#FFB823]/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl"></div>
        
        <div className="relative z-10">
          <h1 className="text-3xl font-black text-white mb-2">{greeting}, Trainer!</h1>
          <p className="text-[#F1F3E0]/80 font-medium max-w-md">
            Welcome back to the E-Kabuhayan portal. You have <span className="text-[#FFB823] font-black">{props.coursesCount} active courses</span> to manage today.
          </p>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="col-span-12 xl:col-span-6 grid grid-cols-2 gap-8">
        {/* Trainees Stat */}
        <div className="h-56 rounded-[2.5rem] bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 p-8 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] flex flex-col justify-between group hover:-translate-y-1 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div className="w-14 h-14 bg-brand-green/10 dark:bg-brand-green/20 rounded-2xl flex items-center justify-center border border-brand-green/20 dark:border-brand-green/30 group-hover:bg-brand-green group-hover:text-white transition-all duration-300 text-brand-green dark:text-brand-green-light group-hover:dark:text-white">
              <SchoolIcon />
            </div>
            <span className="text-[10px] font-black text-brand-green dark:text-brand-green-light uppercase tracking-widest bg-brand-green/5 dark:bg-brand-green/10 px-3 py-1 rounded-full border border-brand-green/10 dark:border-brand-green/20">Live</span>
          </div>
          <div>
            <p className="text-4xl font-black text-slate-800 dark:text-slate-100 leading-none mb-2">{props.traineeCount}</p>
            <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Total Enrolled Trainees</p>
          </div>
        </div>

        {/* Courses Stat */}
        <div className="h-56 rounded-[2.5rem] bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 p-8 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] flex flex-col justify-between group hover:-translate-y-1 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div className="w-14 h-14 bg-amber-50 dark:bg-amber-950/20 rounded-2xl flex items-center justify-center border border-amber-100 dark:border-amber-900/30 group-hover:bg-amber-500 group-hover:text-white transition-all duration-300 text-amber-600 dark:text-amber-400 group-hover:dark:text-white">
              <MenuBookIcon />
            </div>
            <span className="text-[10px] font-black text-amber-600 dark:text-amber-400 uppercase tracking-widest bg-amber-50 dark:bg-amber-950/30 px-3 py-1 rounded-full border border-amber-100 dark:border-amber-900/30">Active</span>
          </div>
          <div>
            <p className="text-4xl font-black text-slate-800 dark:text-slate-100 leading-none mb-2">{props.coursesCount}</p>
            <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Total Active Subjects</p>
          </div>
        </div>
      </div>
    </div>
  )
}
