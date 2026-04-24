import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Navbar from './components/Navbar.jsx'
import Profile from './components/dashboard/Profile.jsx' 
import Course from './components/course/Course.jsx';
import { API_URL } from '../../api.js';
import GroupsIcon from '@mui/icons-material/Groups';
import ThemeToggle from '../../ThemeToggle';

export default function TraineeCourse() {
  const [data, setData] = useState([]);
  const [userData, setUserData] = useState([]); // Added for the Profile Header

  async function fetchData() {
    try {
      // Fetch trainee courses and trainee dashboard info for the profile header
      const [courseRes, userRes] = await Promise.all([
        axios.get(`${API_URL}/trainee/course`, { withCredentials: true }),
        axios.get(`${API_URL}/trainee/dashboard`, { withCredentials: true })
      ])
      setData(courseRes.data.data)
      setUserData(userRes.data)
    } catch (error) {
      console.log("Error fetching trainee data:", error)
    }
  }

  useEffect(() => {
    fetchData();
  }, [])

  // Logic for profile color mapping (Replicated from Trainer)
  const colorMap = {
    red: { 500: 'bg-red-500' }, yellow: { 500: 'bg-yellow-500' },
    green: { 500: 'bg-green-500' }, orange: { 500: 'bg-orange-500' },
    blue: { 500: 'bg-blue-500' }, purple: { 500: 'bg-purple-500' },
    pink: { 500: 'bg-pink-500' },
  }
  const userColorClass = colorMap[userData.color]?.[userData.shade] || 'bg-gray-500';

  return (
    <div className="flex w-screen h-screen bg-[#F8FAFC] dark:bg-slate-950 overflow-hidden font-sans text-slate-900 dark:text-slate-100 transition-colors duration-300">
      
      {/* Background Image - Replicated from Trainer */}
      <div className="absolute inset-0 -z-10">
        <img
          src="/images/plmro.jpg"
          alt="background"
          className="w-full h-full object-cover opacity-[0.03] dark:opacity-[0.02] grayscale"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-white via-transparent to-slate-100/50 dark:from-slate-900/50 dark:to-emerald-900/20" />
      </div>

      <Navbar />

      <div className="flex-1 flex flex-col relative overflow-hidden">
        
        {/* REPLICATED HEADER */}
        <header className="h-20 flex items-center justify-between px-10 bg-white/40 dark:bg-slate-900/60 backdrop-blur-md border-b border-slate-200/60 dark:border-slate-800/60 sticky top-0 z-[50] transition-colors duration-300">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-blue-50 dark:bg-blue-950/20 rounded-xl border border-blue-100 dark:border-blue-900/30 shadow-sm">
              <GroupsIcon className="text-blue-700 dark:text-blue-400 w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-black text-slate-800 dark:text-slate-100 tracking-tight leading-tight">My Courses</h1>
              <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-none mt-0.5">Trainee Portal</p>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <ThemeToggle />
            <Profile data={userData} userColorClass={userColorClass} />
          </div>
        </header>

        {/* MAIN CONTENT AREA */}
        <main className="flex-1 overflow-y-auto px-10 py-8 custom-scrollbar">
          <div className="max-w-[1600px] mx-auto">
            <div className="flex flex-wrap gap-8 mt-4">
              
              {data.length > 0 ? (
                data.map((course) => (
                  <Course
                    id={course.id}
                    key={course.id}
                    title={course.title}
                    description={course.description}
                    image={course.picture}
                    // Trainee might not need handleRefresh, but keeping it for structure
                    handleRefresh={fetchData} 
                  />
                ))
              ) : (
                <div className="w-full py-24 text-center bg-slate-50/50 dark:bg-slate-900/20 rounded-[2.5rem] border border-dashed border-slate-200 dark:border-slate-700 mt-8">
                  <p className="text-slate-400 dark:text-slate-600 font-bold text-sm uppercase tracking-wider">No courses joined yet.</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}