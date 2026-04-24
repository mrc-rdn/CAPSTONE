import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Navbar from './components/Navbar.jsx'
import Profile from './components/dashboard/Profile.jsx' // Import Profile
import Course from './components/course/Course.jsx'
import CourseModal from './components/UI/modal/CourseModal.jsx'
import { API_URL } from '../../api.js'
import AddIcon from '@mui/icons-material/Add';
import GroupsIcon from '@mui/icons-material/Groups'; // Use GroupsIcon for Course Management
import ThemeToggle from '../../ThemeToggle';

export default function My_Batch() {
  const [isModal, setIsModal] = useState(false)
  const [data, setData] = useState([]) // Course data
  const [userData, setUserData] = useState([]) // Dashboard/User data for Header
  
  function handleExit(exit) {
    setIsModal(exit)
    fetchData();
  }
  
  function handleModal() {
    setIsModal(true)
  }

  async function fetchData() {
    try {
      // Fetch both courses and user dashboard data to populate the profile header
      const [courseRes, userRes] = await Promise.all([
        axios.get(`${API_URL}/trainer/course`, { withCredentials: true }),
        axios.get(`${API_URL}/trainer/dashboard`, { withCredentials: true })
      ])
      console.log(courseRes.data.data)
      setData(courseRes.data.data)
      setUserData(userRes.data)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchData();
  }, [])

  // Logic for profile color mapping (matching your Dashboard)
  const colorMap = {
    red: { 500: 'bg-red-500' }, yellow: { 500: 'bg-yellow-500' },
    green: { 500: 'bg-green-500' }, orange: { 500: 'bg-orange-500' },
    blue: { 500: 'bg-blue-500' }, purple: { 500: 'bg-purple-500' },
    pink: { 500: 'bg-pink-500' },
  }
  const userColorClass = colorMap[userData.color]?.[userData.shade] || 'bg-gray-500';

  return (
    <div className="flex w-screen h-screen bg-[#F8FAFC] dark:bg-slate-950 overflow-hidden font-sans text-slate-900 dark:text-slate-100 transition-colors duration-300">
      {/* Background Image - Matching Dashboard */}
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
        
        {/* REPLICATED HEADER FROM DASHBOARD */}
        <header className="h-20 flex items-center justify-between px-10 bg-white/40 dark:bg-slate-900/60 backdrop-blur-md border-b border-slate-200/60 dark:border-slate-800/60 sticky top-0 z-[50] transition-colors duration-300">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-amber-50 dark:bg-amber-950/20 rounded-xl border border-amber-100 dark:border-amber-900/30 shadow-sm">
              <GroupsIcon className="text-amber-700 dark:text-amber-400 w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-black text-slate-800 dark:text-slate-100 tracking-tight leading-tight">Course Management</h1>
              <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-none mt-0.5">Trainer Portal</p>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <ThemeToggle />
            <Profile data={userData} userColorClass={userColorClass} />
          </div>
        </header>
        
        <main className="flex-1 overflow-y-auto px-10 py-8 custom-scrollbar">
          <div className="max-w-[1600px] mx-auto">
            <div className="flex flex-wrap gap-8 mt-4">
                
              {/* Create Course Button Card */}
              <button 
                onClick={handleModal}
                className="group w-72 h-64 flex flex-col items-center justify-center gap-4 rounded-[2.5rem] bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 hover:border-brand-green/40 dark:hover:border-emerald-500/40 transition-all duration-300 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] dark:shadow-none"
              >
                <div className="w-16 h-16 rounded-full bg-brand-green/10 dark:bg-emerald-900/30 flex items-center justify-center text-brand-green dark:text-emerald-400 group-hover:bg-brand-green dark:group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300">
                  <AddIcon sx={{ fontSize: 40 }} />
                </div>
                <span className="text-xl font-black text-brand-green dark:text-emerald-400">Create Course</span>
              </button>

              {data.length > 0 ? (
                data.map((course) => (
                  <Course
                    id={course.id}
                    key={course.id}
                    title={course.title}
                    description={course.description}
                    image={course.picture}
                    handleRefresh={fetchData}
                  />
                ))
              ) : null}
            </div>
            
            {data.length === 0 && !isModal && (
              <div className="col-span-full py-24 text-center bg-slate-50/50 dark:bg-slate-900/20 rounded-[2.5rem] border border-dashed border-slate-200 dark:border-slate-700 mt-8">
                <p className="text-slate-400 dark:text-slate-600 font-bold text-sm uppercase tracking-wider">No courses created yet.</p>
              </div>
            )}
          </div>
        </main>
      </div>

      {isModal && <CourseModal onExit={handleExit} />}
    </div>
  )
}
