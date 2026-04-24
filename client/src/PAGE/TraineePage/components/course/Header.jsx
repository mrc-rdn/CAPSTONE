import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CampaignIcon from '@mui/icons-material/Campaign';
import axios from 'axios';
import { API_URL } from '../../../../api';
import CircularProgress from '@mui/material/CircularProgress';

export default function Header(props) {
    const [notifications, setNotificaitons] = useState(0);
    const [progress, setProgress] = useState([]);

    function deslugify(slug) {
        if (!slug) return "";
        return slug
            .replace(/-/g, ' ')
            .replace(/\b\w/g, char => char.toUpperCase());
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [result, progressRes] = await Promise.all([
                    axios.get(`${API_URL}/admin/announcement/${props.courseId}/notificaitons`, { withCredentials: true }),
                    axios.get(`${API_URL}/trainee/traineeprogress/${props.courseId}`, { withCredentials: true }),
                ]);
                setProgress(progressRes.data.data);
                setNotificaitons(result.data.totalNotif);
            } catch (error) {
                console.error("Error fetching header data:", error);
            }
        };
        fetchData();
    }, [props.courseId, props.refresh]);

    function getCompletionPercentagePerUser(data) {
        if (!data || data.length === 0) return [{ percentage: 0 }];
        const users = {};
        data.forEach(item => {
            const userId = item.user_id;
            if (!users[userId]) {
                users[userId] = { total: 0, done: 0 };
            }
            users[userId].total += 1;
            if (item.is_done) users[userId].done += 1;
        });

        return Object.values(users).map(user => ({
            percentage: Math.round((user.done / user.total) * 100)
        }));
    }

    const result = getCompletionPercentagePerUser(progress);
    const currentPercentage = result[0]?.percentage || 0;

    return (
        <div className="w-full h-full flex items-center">
            
            {/* LEFT SIDE: Back & Title (Trainer Style) */}
            <div className="flex items-center gap-6">
                <Link to="/trainee/course">
                    <button className="w-10 h-10 rounded-xl bg-[#2D4F2B]/10 text-[#2D4F2B] flex items-center justify-center hover:bg-[#2D4F2B] hover:text-white transition-all duration-300">
                        <ArrowBackIcon fontSize="small" />
                    </button>
                </Link>

                <div className="flex flex-col">
                    <p className="text-[10px] font-black uppercase tracking-widest text-[#2D4F2B]/40 leading-none mb-1">
                        Learning Path
                    </p>
                    <h1 className="text-xl font-black text-[#2D4F2B] truncate max-w-md">
                        {deslugify(props.courseTitle)}
                    </h1>
                </div>
            </div>

            {/* RIGHT SIDE: Progress & Announcements */}
            <div className="flex ml-auto items-center gap-4">
                
                {/* PROGRESS SECTION */}
                <div className='flex items-center gap-3 bg-[#2D4F2B]/5 px-4 py-2 rounded-2xl border border-[#2D4F2B]/10'>
                    <div className="relative flex items-center justify-center">
                        <CircularProgress 
                            variant="determinate" 
                            value={currentPercentage} 
                            size={32} 
                            thickness={5}
                            sx={{ color: '#2D4F2B' }}
                        />
                        <span className='absolute text-[8px] font-bold text-[#2D4F2B]'>
                            {currentPercentage}%
                        </span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[9px] font-black uppercase tracking-tighter text-[#2D4F2B]/50 leading-none">Your Status</span>
                        <span className="text-xs font-bold text-[#2D4F2B]">Progress</span>
                    </div>
                </div>

                {/* ANNOUNCEMENT BUTTON (Trainer Style) */}
                <div className="relative">
                    <button
                        onClick={() => props.handleOpenAnnouncementModal(notifications)}
                        className="flex items-center gap-2 px-4 py-2.5 text-xs font-black uppercase tracking-widest text-[#2D4F2B] hover:bg-[#2D4F2B]/10 rounded-xl transition-all"
                    >
                        <CampaignIcon fontSize="small" />
                        <span className="hidden md:block">Announcements</span>
                    </button>
                    
                    {notifications > 0 && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center border-2 border-white dark:border-slate-900 animate-bounce">
                            <span className="text-[10px] font-bold">{notifications}</span>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}