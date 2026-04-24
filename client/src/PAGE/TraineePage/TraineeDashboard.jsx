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
import ThemeToggle from '../../ThemeToggle';

export default function TraineeDashboard() {
  const [data, setData] = useState([])
  const [upcomingEventsData, setUpcomingEventData] = useState([])
  const [courses, setCourseData] = useState([])
  const [refresh, setRefresh] = useState(0)

  // Combined fetch logic for cleaner mounting
  useEffect(() => {
    async function fetchData() {
      try {
        const [courseRes, dashboardRes] = await Promise.all([
          axios.get(`${API_URL}/trainee/course`, { withCredentials: true }),
          axios.get(`${API_URL}/trainee/dashboard`, { withCredentials: true })
        ]);
        setCourseData(courseRes.data.data);
        setData(dashboardRes.data);
      } catch (error) {
        console.error("Error fetching trainee data", error);
      }
    }
    fetchData();
  }, [refresh]);

  const handleRefresh = () => setRefresh(prev => prev + 1);

  const colorMap = {
    red: { 500: 'bg-red-500' },
    green: { 500: 'bg-emerald-500' },
    blue: { 500: 'bg-blue-500' },
    // ... add others as needed
  };

  const userColorClass = colorMap[data.color]?.[data.shade] || 'bg-slate-500';
  const handleUpcomingEventData = (data) => setUpcomingEventData(data);

  return (
    <div className="flex w-screen h-screen bg-[#F8FAFC] dark:bg-slate-950 overflow-hidden font-sans text-slate-900 dark:text-slate-100 transition-colors duration-500">
      
      {/* GLOBAL BACKGROUND LAYER */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <img
          src="/images/plmro.jpg"
          alt="Dashboard background"
          className="w-full h-full object-cover opacity-[0.04] dark:opacity-[0.02] grayscale"
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-slate-100/50 via-transparent to-emerald-50/30 dark:from-slate-950 dark:via-slate-950/80 dark:to-emerald-900/10" />
      </div>

      <Navbar />

      <div className="flex-1 flex flex-col relative overflow-hidden">
        
        {/* SHARED GLASS HEADER */}
        <header className="h-20 shrink-0 flex items-center justify-between px-10 bg-white/60 dark:bg-slate-900/40 backdrop-blur-md border-b border-slate-200/60 dark:border-slate-800/50 sticky top-0 z-[50]">
          <div className="flex items-center gap-4">
            <div className="p-2.5 bg-emerald-600 rounded-xl shadow-lg shadow-emerald-200 dark:shadow-none">
              <DashboardIcon className="text-white w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-black text-slate-800 dark:text-white tracking-tight leading-tight uppercase">Learning Hub</h1>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-none">Trainee Portal</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <ThemeToggle />
            <Profile data={data} userColorClass={userColorClass} />
          </div>
        </header>

        {/* MAIN SCROLLABLE VIEWPORT */}
        <main className="flex-1 overflow-y-auto px-10 py-8 custom-scrollbar">
          <div className="max-w-[1600px] mx-auto space-y-8">
            
            {/* Top Welcome Section (Progress/Stats) */}
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
              <Dcontent courseId={courses[0]} />
            </div>
            
            <div className="grid grid-cols-12 gap-8">
              
              {/* LEFT COLUMN: Course Cards */}
              <div className="col-span-12 lg:col-span-8 space-y-8 animate-in fade-in slide-in-from-left-4 duration-700 delay-100">
                <section className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-[3rem] border border-slate-200/60 dark:border-slate-800/60 p-8 shadow-xl shadow-slate-200/40 dark:shadow-none">
                  <div className="flex items-center gap-3 mb-8 px-2">
                    <div className="w-10 h-10 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl flex items-center justify-center border border-emerald-100 dark:border-emerald-900/30">
                      <GroupsIcon className="text-emerald-600 dark:text-emerald-400 w-5 h-5" />
                    </div>
                    <h2 className="text-xl font-black text-slate-800 dark:text-slate-100 tracking-tight uppercase">Your Curriculum</h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {courses.length > 0 ? (
                      courses.map((course) => <Courses key={course.id} course={course} />)
                    ) : (
                      <div className="col-span-full py-20 text-center bg-slate-50/50 dark:bg-slate-800/20 rounded-[2.5rem] border-2 border-dashed border-slate-200 dark:border-slate-700">
                        <p className="text-xs font-black text-slate-300 dark:text-slate-600 uppercase tracking-widest">Enrollment Pending</p>
                      </div>
                    )}
                  </div>
                </section>
              </div>

              {/* RIGHT COLUMN: Calendar & Timeline */}
              <div className="col-span-12 lg:col-span-4 space-y-8 animate-in fade-in slide-in-from-right-4 duration-700 delay-200">
                
                {/* Calendar Card */}
                <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-[3rem] border border-slate-200/60 dark:border-slate-800/60 p-4 shadow-xl shadow-slate-200/40 dark:shadow-none">
                  <CalendarTodo handleUpcomingEventData={handleUpcomingEventData} onRefresh={handleRefresh} />
                </div>

                {/* Timeline Card */}
                <section className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-[3rem] border border-slate-200/60 dark:border-slate-800/60 p-8 shadow-xl shadow-slate-200/40 dark:shadow-none flex flex-col min-h-[400px]">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl flex items-center justify-center border border-indigo-100 dark:border-indigo-900/30">
                      <CalendarToday className="text-indigo-600 dark:text-indigo-400 w-5 h-5" />
                    </div>
                    <h2 className="text-xl font-black text-slate-800 dark:text-slate-100 tracking-tight uppercase">Deadlines</h2>
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
                        <p className="text-[10px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-widest">No pending tasks</p>
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