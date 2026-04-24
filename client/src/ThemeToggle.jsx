import React from 'react';
import { useTheme } from './ThemeContext';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';

export default function ThemeToggle() {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2.5 rounded-xl transition-all duration-300 flex items-center justify-center
                 bg-slate-100 hover:bg-slate-200 text-slate-600 
                 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-amber-400
                 shadow-sm hover:shadow-md border border-slate-200 dark:border-slate-700"
      title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
    >
      {isDarkMode ? (
        <LightModeIcon sx={{ fontSize: 20 }} className="animate-in spin-in-180 duration-500" />
      ) : (
        <DarkModeIcon sx={{ fontSize: 20 }} className="animate-in spin-in-180 duration-500" />
      )}
    </button>
  );
}
