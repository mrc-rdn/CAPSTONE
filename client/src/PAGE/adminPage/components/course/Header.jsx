import React from 'react'
import { Link } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CampaignIcon from '@mui/icons-material/Campaign';
import BarChartIcon from '@mui/icons-material/BarChart';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1'; // Specific for Add Trainee

export default function Header(props) {

    function deslugify(slug) {
        if (!slug) return "";
        return slug
            .replace(/-/g, ' ')
            .replace(/\b\w/g, char => char.toUpperCase());
    }

    return (
        <div className="w-full h-full px-6 flex items-center">

            {/* LEFT SIDE: Back Button and Title */}
            <div className="flex items-center gap-6">
                <Link to="/admin/course">
                    <button className="w-10 h-10 rounded-xl bg-[#2D4F2B]/10 text-[#2D4F2B] flex items-center justify-center hover:bg-[#2D4F2B] hover:text-white transition-all duration-300">
                        <ArrowBackIcon fontSize="small" />
                    </button>
                </Link>

                <div className="flex flex-col">
                    <p className="text-[10px] font-black uppercase tracking-widest text-[#2D4F2B]/40 leading-none mb-1">
                        Admin Portal
                    </p>

                    <h1 className="text-xl font-black text-[#2D4F2B] dark:text-emerald-400 truncate max-w-md">
                        {deslugify(props.courseTitle)}
                    </h1>
                </div>
            </div>

            {/* RIGHT SIDE: Action Buttons */}
            <div className="flex ml-auto items-center gap-2">

                <button
                    onClick={props.handleOpenAnnouncementModal}
                    className="flex items-center gap-2 px-4 py-2 text-xs font-black uppercase tracking-widest text-[#2D4F2B] dark:text-slate-200 hover:bg-[#2D4F2B]/5 dark:hover:bg-white/5 rounded-xl transition-all"
                >
                    <CampaignIcon fontSize="small" />
                    <span className="hidden md:block">Announcement</span>
                </button>

                <button
                    onClick={props.handleOpenTrianeeProgressModal}
                    className="flex items-center gap-2 px-4 py-2 text-xs font-black uppercase tracking-widest text-[#2D4F2B] dark:text-slate-200 hover:bg-[#2D4F2B]/5 dark:hover:bg-white/5 rounded-xl transition-all"
                >
                    <BarChartIcon fontSize="small" />
                    <span className="hidden md:block">Progress</span>
                </button>

                {/* Specific Admin Action: Add Trainee */}
                <button
                    onClick={props.handleOpenAddTraineeModal}
                    className="flex items-center gap-2 px-4 py-2 text-xs font-black uppercase tracking-widest text-[#2D4F2B] dark:text-slate-200 hover:bg-[#2D4F2B]/5 dark:hover:bg-white/5 rounded-xl transition-all"
                >
                    <PersonAddAlt1Icon fontSize="small" />
                    <span className="hidden md:block">Add Trainee</span>
                </button>

                {/* Primary Action: Add Chapter */}
                <button
                    onClick={props.handleOpenChapterAddModal}
                    className="flex items-center gap-2 px-5 py-2.5 text-xs font-black uppercase tracking-widest bg-[#2D4F2B] dark:bg-emerald-600 text-white rounded-xl hover:bg-[#1e3a1c] dark:hover:bg-emerald-700 shadow-lg shadow-[#2D4F2B]/20 transition-all"
                >
                    <AddCircleOutlineIcon fontSize="small" />
                    <span>Add Chapter</span>
                </button>

            </div>

        </div>
    )
}