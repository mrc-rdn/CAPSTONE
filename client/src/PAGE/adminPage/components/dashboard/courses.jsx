import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { API_URL } from '../../../../api'

export default function Courses({ course }) {
  const [enrolled, setEnrolled] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `${API_URL}/admin/${course.id}/enrolled`,
          { withCredentials: true }
        )
        setEnrolled(res.data.data)
      } catch (error) {
        console.error("Error fetching enrolled students:", error)
      }
    }
    fetchData()
  }, [course.id]) // Added dependency for safety

  return (
    <div className="group w-full h-44 p-6 rounded-[2rem] bg-[#F1F3E0]/50 dark:bg-slate-800/40 border border-[#2D4F2B]/5 dark:border-emerald-500/10 hover:bg-white dark:hover:bg-slate-800 hover:border-[#2D4F2B]/20 dark:hover:border-emerald-500/30 hover:shadow-xl hover:shadow-[#2D4F2B]/5 dark:hover:shadow-none transition-all duration-300 flex flex-col justify-between overflow-hidden relative">
      
      {/* Decorative Background Element */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-[#FFB823]/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform duration-500"></div>

      {/* Course Info */}
      <div className="relative z-10">
        <h3 className="text-sm font-black text-[#2D4F2B] dark:text-emerald-400 uppercase tracking-tight mb-2 group-hover:text-[#FFB823] transition-colors line-clamp-1">
          {course.title}
        </h3>
        <p className="text-[11px] text-[#2D4F2B]/60 dark:text-slate-400 font-bold leading-relaxed line-clamp-2">
          {course.description || "Administrative oversight for community vocational training programs."}
        </p>
      </div>

      {/* Footer Stats & Action */}
      <div className="relative z-10 pt-4 flex items-center justify-between">
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#2D4F2B] dark:bg-emerald-600 rounded-full shadow-lg shadow-[#2D4F2B]/20 dark:shadow-emerald-900/20">
          <div className="w-1 h-1 rounded-full bg-[#FFB823] animate-pulse"></div>
          <span className="text-[9px] font-black text-white uppercase tracking-widest">
            {enrolled.length} Students
          </span>
        </div>
        
        <div className="w-8 h-8 rounded-full bg-white dark:bg-slate-900 border border-[#2D4F2B]/5 dark:border-slate-700 flex items-center justify-center text-[#2D4F2B] dark:text-emerald-400 group-hover:bg-[#2D4F2B] dark:group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300">
           <span className="text-xs font-black">→</span>
        </div>
      </div>
    </div>
  )
}