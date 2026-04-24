import React, { useEffect, useState } from 'react'
import Navbar from './components/Navbar'
import Dcontent from './components/dashboard/DContent.jsx'
import CalendarTodo from './components/dashboard/CalendarTodo.jsx'
import axios from 'axios'
import { API_URL } from '../../api'
import Profile from './components/dashboard/Profile.jsx'
import UpcomingEvents from './components/dashboard/UpcomingEvents.jsx'
import Courses from './components/dashboard/courses.jsx'
import DashboardIcon from '@mui/icons-material/Dashboard';
import GroupsIcon from '@mui/icons-material/Groups';
import CalendarToday from '@mui/icons-material/CalendarToday';
import { Link } from 'react-router-dom';
import ThemeToggle from '../../ThemeToggle';

export default function AdminDashboard() {
  // --- LOGIC: Kept from original Admin Dashboard ---
  const [data, setData] = useState([])
  const [upcomingEventsData, setUpcomingEventData] = useState([])
  const [courses, setCourseData] = useState([])
  const [refresh, setRefresh] = useState(0)

  useEffect(() => {
    async function fetchData() {
      try {
        const [response, course] = await Promise.all([
          axios.get(`${API_URL}/admin/dashboard`, { withCredentials: true }),
          axios.get(`${API_URL}/admin/course`, { withCredentials: true })
        ])
        setCourseData(course.data.data)
        setData(response.data)
      } catch (error) {
        console.log("error fetching data", error)
      }
    }
    fetchData()
  }, [refresh])

  const handleRefresh = () => {
    setRefresh(prev => prev + 1)
  }

  const handleUpcomingEventData = (data) => {
    setUpcomingEventData(data)
  }

  // --- DESIGN CONFIG: Updated to match Trainer's visual style ---
  const colorMap = {
    red: { 500: 'bg-red-500' }, yellow: { 500: 'bg-yellow-500' },
    green: { 500: 'bg-emerald-500' }, orange: { 500: 'bg-orange-500' },
    blue: { 500: 'bg-blue-500' }, purple: { 500: 'bg-purple-500' },
    pink: { 500: 'bg-pink-500' },
  }
  const userColorClass = colorMap[data.color]?.[data.shade] || 'bg-slate-500';

  return (
    <div className="flex w-screen h-screen bg-[#F8FAFC] dark:bg-slate-950 overflow-hidden font-sans text-slate-900 dark:text-slate-100 transition-colors duration-500">
      
      {/* GLOBAL BACKGROUND - Inherited from Trainer */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <img
          src="/images/plmro.jpg"
          alt="Dashboard background"
          className="w-full h-full object-cover opacity-[0.04] dark:opacity-[0.02] grayscale"
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-slate-100/50 via-transparent to-emerald-50/30 dark:from-slate-950 dark:via-slate-950/80 dark:to-emerald-950/20" />
      </div>

      <Navbar />
      
      <div className="flex-1 flex flex-col relative overflow-hidden">
        
        {/* HEADER: Modern Glass effect */}
        <header className="h-20 shrink-0 flex items-center justify-between px-10 bg-white/60 dark:bg-slate-900/40 backdrop-blur-md border-b border-slate-200/60 dark:border-slate-800/50 sticky top-0 z-[50] transition-colors duration-500">
          <div className="flex items-center gap-4">
            <div className="p-2.5 bg-emerald-600 rounded-xl shadow-lg shadow-emerald-200 dark:shadow-emerald-900/20">
              <DashboardIcon className="text-white w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-black text-slate-800 dark:text-white tracking-tight leading-tight uppercase">Admin Dashboard</h1>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-none">System Active</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <ThemeToggle />
            <Profile data={data} userColorClass={userColorClass} />
          </div>
        </header>

        {/* MAIN VIEWPORT: Uses Trainer's high-res grid layout */}
        <main className="flex-1 overflow-y-auto px-10 py-8 custom-scrollbar">
          <div className="max-w-[1600px] mx-auto space-y-8">
            
            {/* Stats Section */}
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
              <Dcontent 
                traineeCount={data.traineeCount} 
                trainerCount={data.trainerCount} 
                coursesCount={courses.length} 
              />
            </div>
            
            <div className="grid grid-cols-12 gap-8">
              {/* Left Column: Courses with Trainer's styling */}
              <div className="col-span-12 lg:col-span-8 space-y-8">
                <section className="h-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-[3rem] border border-slate-200/60 dark:border-slate-800/60 p-8 shadow-xl shadow-slate-200/40 dark:shadow-none transition-colors duration-500">
                  <div className="flex items-center justify-between mb-8 px-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-amber-50 dark:bg-amber-900/20 rounded-2xl flex items-center justify-center border border-amber-100 dark:border-amber-900/30 shadow-sm">
                        <GroupsIcon className="text-amber-600 dark:text-amber-400 w-5 h-5" />
                      </div>
                      <h2 className="text-xl font-black text-slate-800 dark:text-slate-100 tracking-tight uppercase">Platform Courses</h2>
                    </div>
                    <Link to="/admin/course" className="group flex items-center gap-3 text-[10px] font-black text-emerald-700 dark:text-emerald-400 uppercase tracking-widest bg-emerald-50 dark:bg-emerald-900/20 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 px-5 py-2.5 rounded-2xl transition-all border border-emerald-100/50 dark:border-emerald-800">
                      Manage All <span className="group-hover:translate-x-1 transition-transform inline-block">→</span>
                    </Link>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {courses.length > 0 ? (
                      courses.map((course) => <Courses key={course.id} course={course} />)
                    ) : (
                      <div className="col-span-full py-20 text-center bg-slate-50/50 dark:bg-slate-800/20 rounded-[2.5rem] border-2 border-dashed border-slate-200 dark:border-slate-700">
                        <p className="text-xs font-black text-slate-300 dark:text-slate-600 uppercase tracking-widest">No active courses found</p>
                      </div>
                    )}
                  </div>
                </section>
              </div>

              {/* Right Column: Calendar & Timeline */}
              <div className="col-span-12 lg:col-span-4 space-y-8">
                <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-[3rem] border border-slate-200/60 dark:border-slate-800/60 p-4 shadow-xl shadow-slate-200/40 dark:shadow-none transition-colors duration-500">
                  <CalendarTodo handleUpcomingEventData={handleUpcomingEventData} onRefresh={handleRefresh} />
                </div>

                <section className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-[3rem] border border-slate-200/60 dark:border-slate-800/60 p-8 shadow-xl shadow-slate-200/40 dark:shadow-none flex flex-col min-h-[400px] transition-colors duration-500">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl flex items-center justify-center border border-indigo-100 dark:border-indigo-900/30 shadow-sm">
                      <CalendarToday className="text-indigo-600 dark:text-indigo-400 w-5 h-5" />
                    </div>
                    <h2 className="text-xl font-black text-slate-800 dark:text-slate-100 tracking-tight uppercase">System Timeline</h2>
                  </div>
                  
                  <div className="flex-1 space-y-4">
                    {upcomingEventsData.length > 0 ? (
                      upcomingEventsData
                        .slice()
                        .sort((a, b) => new Date(a.event_date) - new Date(b.event_date))
                        .map((item, index) => (
                          <UpcomingEvents
                            key={index}
                            text={item.text}
                            eventDate={item.event_date}
                            color={item.color}
                          />
                        ))
                    ) : (
                      <div className="py-12 text-center">
                        <p className="text-[10px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-widest">No scheduled events</p>
                      </div>
                    )}
                  </div>
                </section>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}