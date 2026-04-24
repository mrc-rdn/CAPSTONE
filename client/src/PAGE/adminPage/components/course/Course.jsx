import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios';
import { API_URL } from '../../../../api.js';
import PeopleIcon from '@mui/icons-material/People';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import { useTheme } from '../../../../ThemeContext';

export default function Course(props) {
    const { isDarkMode } = useTheme();
    const [enrolled, setenrolled] = useState([])
    const [openModal, setOpenModal] = useState(false)

    function slugify(text) {
        return text.toLowerCase().replace(/\s+/g, '-');
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Admin specific enrollment endpoint
                const res = await axios.get(`${API_URL}/admin/${props.id}/enrolled`, { withCredentials: true })
                setenrolled(res.data.data)
            } catch (error) {
                console.log(error)
            }
        }
        fetchData()
    }, [props.id])

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            // Admin specific delete endpoint
            await axios.delete(`${API_URL}/admin/coursedelete/${props.id}`, { withCredentials: true })
            setOpenModal(false)
            if (props.handleRefresh) props.handleRefresh();
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className="relative">
            {/* High-Fidelity Delete Modal */}
            {openModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 dark:bg-slate-950/80 backdrop-blur-md p-4">
                    <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-white/20 dark:border-slate-800">
                        <div className="p-8 text-center">
                            <div className="w-20 h-20 bg-red-100 dark:bg-red-950/30 rounded-full flex items-center justify-center mx-auto mb-6">
                                <span className="text-4xl">⚠️</span>
                            </div>
                            <h2 className="text-2xl font-black text-[#2D4F2B] dark:text-emerald-400 mb-2 tracking-tight">Delete Course?</h2>
                            <p className="text-[#2D4F2B]/60 dark:text-slate-400 mb-8 font-medium">This administrative action cannot be undone.</p>
                            
                            <div className="flex flex-col gap-3">
                                <button
                                    className="w-full py-4 bg-red-500 text-white rounded-2xl font-black hover:bg-red-600 transition-all shadow-lg shadow-red-500/20 uppercase text-xs tracking-widest"
                                    onClick={handleSubmit}
                                >
                                    YES, DELETE IT
                                </button>
                                <button
                                    className="w-full py-4 bg-[#2D4F2B]/5 dark:bg-slate-800 text-[#2D4F2B] dark:text-slate-100 rounded-2xl font-black hover:bg-[#2D4F2B]/10 dark:hover:bg-slate-700 transition-all uppercase text-xs tracking-widest"
                                    onClick={() => setOpenModal(false)}
                                >
                                    CANCEL
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Course Card Design */}
            <div className="group w-72 h-96 flex flex-col rounded-[2.5rem] bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-white/20 dark:border-slate-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden">
                
                {/* Image Header with Delete Trigger */}
                <div className="relative h-36 bg-[#2D4F2B] dark:bg-emerald-800 overflow-hidden">
                    {props.image ? (
                        <img src={props.image} alt="Course" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <PlayCircleOutlineIcon sx={{ fontSize: 60, color: 'white', opacity: 0.3 }} />
                        </div>
                    )}
                    
                    {/* Floating Delete Button */}
                    <div className="absolute top-4 right-4">
                        <button 
                            onClick={(e) => { e.preventDefault(); setOpenModal(true); }}
                            className="w-8 h-8 rounded-full bg-black/20 backdrop-blur-md text-white flex items-center justify-center hover:bg-red-500 transition-colors"
                        >
                            ×
                        </button>
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 p-6 flex flex-col">
                    <div className="flex-1">
                        <h3 className="text-xl font-black text-[#2D4F2B] dark:text-emerald-400 line-clamp-1 mb-1 uppercase tracking-tight">
                            {props.title}
                        </h3>
                        <p className="text-sm text-[#2D4F2B]/60 dark:text-slate-400 font-medium line-clamp-2 leading-relaxed mb-4">
                            {props.description || "No description available for this curriculum."}
                        </p>
                    </div>

                    {/* Enrollment Stat */}
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-100/50 dark:bg-amber-950/20 border border-amber-200/50 dark:border-amber-900/30">
                            <PeopleIcon sx={{ fontSize: 18, color: isDarkMode ? '#10b981' : '#2D4F2B' }} />
                            <span className="text-[10px] font-black text-[#2D4F2B] dark:text-emerald-400 uppercase tracking-wider">
                                {enrolled.length} Enrolled
                            </span>
                        </div>
                    </div>

                    {/* Navigation Link */}
                    <Link to={`/admin/course/${props.id}/${slugify(props.title)}`} className="w-full">
                        <button className="w-full h-12 rounded-2xl bg-[#2D4F2B] dark:bg-emerald-600 text-white font-black text-[10px] uppercase tracking-[0.2em] hover:bg-[#1e3a1c] dark:hover:bg-emerald-700 transition-all active:scale-95 shadow-lg shadow-[#2D4F2B]/10 dark:shadow-none">
                            Enter Subject
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    )
}