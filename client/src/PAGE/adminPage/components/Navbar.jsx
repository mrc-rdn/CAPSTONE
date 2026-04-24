import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Logout from "./Logout";
import { motion, AnimatePresence } from 'framer-motion';

// Icons
import DashboardIcon from '@mui/icons-material/Dashboard';
import GroupsIcon from '@mui/icons-material/Groups';
import MessageIcon from '@mui/icons-material/Message';
import PersonIcon from '@mui/icons-material/Person';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';

export default function AdminNavbar() {
  const location = useLocation();
  const [isExpanded, setIsExpanded] = useState(false);

  // Admin-specific menu items
  const menuItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: DashboardIcon },
    { name: 'Course', path: '/admin/course', icon: GroupsIcon },
    { name: 'Master List', path: '/admin/statistics', icon: FormatListBulletedIcon },
    { name: 'Messages', path: '/admin/messages', icon: MessageIcon },
    { name: 'Create Account', path: '/admin/createaccount', icon: PersonIcon },
  ];

  return (
    <motion.div 
      initial={false}
      animate={{ width: isExpanded ? 260 : 80 }}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
      transition={{ type: 'spring', stiffness: 200, damping: 25 }}
      className="h-screen flex flex-col bg-white dark:bg-slate-900 border-r border-slate-200/60 dark:border-slate-800 shadow-[4px_0_24px_rgba(0,0,0,0.02)] overflow-hidden relative z-[100] transition-colors duration-300"
    >
      {/* Brand Section */}
      <div className={cn(
        "flex items-center w-full h-20 px-6 border-b border-slate-100/80 dark:border-slate-800 transition-all",
        !isExpanded && "justify-center px-0"
      )}>
        <div className="flex items-center gap-4">
          <div className="relative group/logo">
            <div className="absolute -inset-2 bg-gradient-to-r from-emerald-500/20 to-amber-500/20 rounded-full blur-xl opacity-0 group-hover/logo:opacity-100 transition duration-500"></div>
            <div className="relative w-10 h-10 flex-shrink-0 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 flex items-center justify-center p-1.5 overflow-hidden transition-transform duration-500 group-hover/logo:scale-110">
              <img src="/images/logo2.gif" alt="Logo" className="w-full h-full object-contain" />
            </div>
          </div>
          
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="flex flex-col"
              >
                <h1 className="text-sm font-black text-slate-900 dark:text-slate-100 tracking-tight leading-tight">
                    <span className="text-emerald-700 dark:text-emerald-500">E</span><span className="text-amber-500">-Kabuhayan</span>
                </h1>
                <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></div>
                    <span className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Administrator</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 flex flex-col mt-6 px-3 gap-1.5">
        <AnimatePresence>
          {isExpanded && (
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="px-4 text-[9px] font-black uppercase tracking-[0.2em] text-slate-300 dark:text-slate-600 mb-2"
            >
              Admin Menu
            </motion.p>
          )}
        </AnimatePresence>

        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "relative flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-200 group",
                !isExpanded && "justify-center px-0",
                isActive 
                  ? "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400" 
                  : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50"
              )}
            >
              {isActive && (
                <motion.div 
                  layoutId="active-bar-admin"
                  className="absolute left-0 w-1 h-6 bg-emerald-600 rounded-r-full"
                />
              )}

              <item.icon className={cn(
                "w-5 h-5 transition-colors duration-200",
                isActive ? "text-emerald-600" : "text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300"
              )} />
              
              <AnimatePresence>
                {isExpanded && (
                  <motion.span 
                    initial={{ opacity: 0, x: -5 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -5 }}
                    className={cn(
                        "text-xs font-black tracking-wide whitespace-nowrap uppercase",
                        isActive ? "text-emerald-700 dark:text-emerald-400" : "text-slate-500 dark:text-slate-400"
                    )}
                  >
                    {item.name}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          );
        })}
      </nav>

      {/* Logout Area */}
      <div className={cn("mt-auto p-4 mb-4 border-t border-slate-100 dark:border-slate-800", !isExpanded && "px-2")}>
        <Logout isCollapsed={!isExpanded} />
      </div>
    </motion.div>
  );
}

// Utility for merging classes
function cn(...inputs) {
  return inputs.filter(Boolean).join(' ');
}