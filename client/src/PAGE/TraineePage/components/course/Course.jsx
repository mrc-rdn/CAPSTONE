import React from 'react'
import { Link } from 'react-router-dom'
import PeopleIcon from '@mui/icons-material/People';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import { useTheme } from '../../../../ThemeContext'; // Assuming path is same as Trainer's

export default function Course(props) {
    const { isDarkMode } = useTheme();

    function slugify(text) {
        return text ? text.toLowerCase().replace(/\s+/g, '-') : '';
    }

    return (
        <div className="relative">
            <div className="group w-72 h-80 flex flex-col rounded-3xl bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-white/20 dark:border-slate-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden">
                
                {/* Course Card Top - Image Section */}
                <div className="relative h-32 bg-[#2D4F2B] dark:bg-emerald-800 overflow-hidden">
                    {props.image ? (
                        <img src={props.image} alt="Course Image" className="w-full h-full object-cover" />
                    ) : (
                        <div>
                            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_50%_50%,#FFB823,transparent)]"></div>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <PlayCircleOutlineIcon sx={{ fontSize: 60, color: 'white', opacity: 0.3 }} />
                            </div>
                        </div>
                    )}
                </div>

                {/* Course Content */}
                <div className="flex-1 p-6 flex flex-col">
                    <div className="flex-1">
                        <h3 className="text-xl font-black text-[#2D4F2B] dark:text-emerald-400 line-clamp-1 mb-1 uppercase tracking-tight">
                            {props.title}
                        </h3>
                        <p className="text-sm text-[#2D4F2B]/60 dark:text-slate-400 font-medium line-clamp-2 leading-relaxed mb-4">
                            {props.description || "Explore your course materials and progress."}
                        </p>
                    </div>

                    <div className="flex items-center justify-between mb-4">
                        {/* Student Status Badge */}
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#FFB823]/10 dark:bg-amber-950/20 border border-[#FFB823]/20 dark:border-amber-900/30">
                            <PeopleIcon sx={{ fontSize: 18, color: isDarkMode ? '#10b981' : '#2D4F2B' }} className="dark:text-emerald-400" />
                            <span className="text-xs font-black text-[#2D4F2B] dark:text-emerald-400 uppercase">
                                Enrolled
                            </span>
                        </div>
                    </div>

                    <Link to={`/trainee/course/${props.id}/${slugify(props.title)}`} className="w-full">
                        <button className="w-full h-12 rounded-2xl bg-[#2D4F2B] dark:bg-emerald-600 text-white font-black text-xs uppercase tracking-widest hover:bg-[#1e3a1c] dark:hover:bg-emerald-700 hover:shadow-lg hover:shadow-[#2D4F2B]/20 dark:hover:shadow-none transition-all active:scale-95">
                            Enter Subject
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    )
}