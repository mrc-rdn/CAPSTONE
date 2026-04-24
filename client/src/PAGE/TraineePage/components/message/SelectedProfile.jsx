import React, { useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
import { API_URL } from '../../../../api.js';

export default function SelectedProfile(props) {
  const [isContactAdded, setIsContactAdded] = useState(false);
  const [isAdded, setIsAdded] = useState("");

  const handleExit = () => props.onExit(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Points to trainee endpoint but uses the trainer's clean logic structure
      const response = await axios.post(
        `${API_URL}/trainee/addContact`, 
        { user2_id: props.id }, 
        { withCredentials: true }
      );
      setIsContactAdded(true);
      setIsAdded(response.data.message);
    } catch (error) {
      console.error('Error adding contacts:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-[10000] p-4">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl border border-slate-200/60 dark:border-slate-800/60 overflow-hidden animate-in fade-in zoom-in duration-300">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 pb-0">
          <div className="flex flex-col">
              <h2 className="text-xl font-black text-slate-800 dark:text-slate-100 tracking-tight uppercase">User Profile</h2>
              {isAdded && (
                <p className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest animate-pulse">
                  {isAdded}
                </p>
              )}
          </div>
          <button 
            onClick={handleExit} 
            className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          >
            <CloseIcon fontSize="small" />
          </button>
        </div>

        <div className="p-8 flex flex-col items-center text-center">
          {/* Avatar Area with Premium Squircle Shape */}
          <div className="relative mb-6">
            {props.profile ? (
              <img 
                src={props.profile} 
                alt="" 
                className="w-28 h-28 rounded-[2rem] object-cover border-4 border-white dark:border-slate-800 shadow-xl" 
              />
            ) : (
              <div className={`w-28 h-28 rounded-[2rem] flex items-center justify-center text-white text-4xl font-black shadow-xl ${props.userColorClass}`}>
                {props.firstName?.slice(0, 1).toUpperCase()}
              </div>
            )}
            {/* Status Indicator */}
            <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-emerald-500 border-4 border-white dark:border-slate-900 rounded-full" />
          </div>

          <h3 className="text-2xl font-black text-slate-800 dark:text-slate-100 tracking-tight">
            {props.firstName} {props.surname}
          </h3>
          <p className="text-sm font-bold text-slate-400 mb-1">@{props.username}</p>
          
          <div className="inline-flex items-center gap-2 bg-slate-50 dark:bg-slate-800/50 px-3 py-1 rounded-full mt-2">
            <span className="text-[10px] font-bold text-slate-300 dark:text-slate-500 uppercase tracking-tighter">
              Member ID: {props.id}
            </span>
          </div>

          <button
            onClick={handleSubmit}
            disabled={isContactAdded}
            className={`w-full mt-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all ${
              isContactAdded 
                ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed' 
                : 'bg-[#2D4F2B] text-white shadow-lg shadow-[#2D4F2B]/20 hover:bg-[#244022] active:scale-95'
            }`}
          >
            {isContactAdded ? 'Added to Network' : 'Add to Contacts'}
          </button>
        </div>
      </div>
    </div>
  );
}