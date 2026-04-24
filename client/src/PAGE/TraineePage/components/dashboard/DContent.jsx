import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../../../../api';
import CampaignIcon from '@mui/icons-material/Campaign'; // Announcements icon
import InfoIcon from '@mui/icons-material/Info';

export default function Content(props) {
  const [announcement, setAnnouncement] = useState([]);
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    // Greeting logic to match Admin style
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) setGreeting("Good Morning");
    else if (hour >= 12 && hour < 17) setGreeting("Good Afternoon");
    else if (hour >= 17 && hour < 21) setGreeting("Good Evening");
    else setGreeting("Good Night");

    const fetchData = async () => {
      try {
        if (props.courseId?.id) {
          const res = await axios.get(`${API_URL}/trainee/announcement/${props.courseId.id}`, { withCredentials: true });
          setAnnouncement(res.data);
        }
      } catch (error) {
        console.error("Error fetching announcements:", error);
      }
    };
    fetchData();
  }, [props.courseId]);

  const colorMap = {
    red: 'bg-red-500', yellow: 'bg-yellow-500', green: 'bg-green-500',
    orange: 'bg-orange-500', blue: 'bg-blue-500', purple: 'bg-purple-500', pink: 'bg-pink-500',
  };

  return (
    <div className="w-full flex flex-col gap-8">
      
      {/* 1. WELCOME BANNER (Matches Admin Style) */}
      <div className="h-56 rounded-[2.5rem] bg-gradient-to-br from-[#2D4F2B] to-[#1e3a1c] p-10 flex flex-col justify-center relative overflow-hidden shadow-2xl shadow-emerald-900/20">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-400/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl"></div>
        
        <div className="relative z-10">
          <h1 className="text-3xl font-black text-white mb-2">{greeting}, Trainee!</h1>
          <p className="text-[#F1F3E0]/80 font-medium max-w-xl">
            Welcome back to your dashboard. You have <span className="text-emerald-400 font-black">{announcement.length} unread announcements</span> for your current course.
          </p>
        </div>
      </div>

      {/* 2. ANNOUNCEMENTS LIST AREA */}
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-3 px-2">
           <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg text-emerald-600">
              <CampaignIcon fontSize="small" />
           </div>
           <h2 className="text-sm font-black text-slate-800 dark:text-slate-200 uppercase tracking-widest">
             Course Announcements
           </h2>
        </div>

        {announcement.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {announcement.map((item, index) => (
              <div
                key={index}
                className="rounded-[2rem] bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 p-6 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] flex flex-col hover:-translate-y-1 transition-all duration-300 group"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {item.profile_pic ? (
                      <img src={item.profile_pic} alt="" className="w-10 h-10 rounded-xl border-2 border-emerald-500/20 object-cover" />
                    ) : (
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white text-xs font-black shadow-lg ${colorMap[item.color] || "bg-emerald-600"}`}>
                        {item.first_name.slice(0, 1)}
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-black text-slate-800 dark:text-slate-100">{item.first_name} {item.surname}</p>
                      <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-tighter">Instructor</p>
                    </div>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                     <InfoIcon sx={{ fontSize: 16 }} />
                  </div>
                </div>

                <h3 className="text-md font-black text-slate-800 dark:text-white mb-2 line-clamp-1 uppercase tracking-tight">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-3 font-medium">
                  {item.message}
                </p>
                
                <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
                   <span className="text-[9px] font-black text-emerald-600 dark:text-emerald-500 uppercase tracking-widest bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded">Official Update</span>
                   <button className="text-[10px] font-black text-slate-400 hover:text-emerald-600 transition-colors uppercase tracking-widest">View Details</button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="h-64 rounded-[2.5rem] bg-white/40 dark:bg-slate-900/40 border-2 border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center">
             <CampaignIcon className="text-slate-300 dark:text-slate-700 mb-2" sx={{ fontSize: 40 }} />
             <p className="text-xs font-black uppercase tracking-widest text-slate-400">No active announcements</p>
          </div>
        )}
      </div>
    </div>
  );
}