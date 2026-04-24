import React from 'react'
import { useNavigate } from "react-router-dom"
import axios from 'axios';
import { API_URL } from '../../../api.js';
import LogoutIcon from '@mui/icons-material/Logout';
import { motion, AnimatePresence } from 'framer-motion';

export default function Logout({ isCollapsed }) {
    const navigate = useNavigate();

    async function handleLogout(event){
        event.preventDefault();
        try {
            const res = await axios.post(`${API_URL}/trainer/dashboard/logout`, {}, { withCredentials: true })
            if (res.data.message === "Successfully logged out") {
                navigate(res.data.redirectTo);
            }
        } catch (error) {
            console.log("logout error", error.message)
        }
    }

    return (
        <button 
            onClick={handleLogout} 
            title={isCollapsed ? "Logout" : ""}
            className={`
                w-full
                flex items-center gap-4
                px-4 py-3.5
                rounded-2xl
                transition-all duration-300
                group
                ${isCollapsed ? "justify-center px-0" : "justify-start"}
                text-slate-400
                hover:bg-red-50
                hover:text-red-600
            `}
        >
            <LogoutIcon className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
            <AnimatePresence>
                {!isCollapsed && (
                    <motion.span 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        className="text-xs font-black tracking-wide uppercase whitespace-nowrap"
                    >
                        Sign Out
                    </motion.span>
                )}
            </AnimatePresence>
        </button>
    )
}
