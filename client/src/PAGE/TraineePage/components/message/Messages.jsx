import React from 'react';
import { motion } from 'framer-motion';

export default function Messages({ message, userData }) {
  // Logic remains consistent to identify if the current user sent the message
  const isSender = message.sender_id === userData.id || message.first_name === userData.first_name;
  
  const formatTime = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`w-full flex ${isSender ? 'justify-end' : 'justify-start'} my-2 px-4`}
    >
      <div className={`flex flex-col ${isSender ? 'items-end' : 'items-start'} max-w-[75%]`}>
        {/* Message Bubble */}
        <div 
          className={`px-4 py-2.5 shadow-sm relative text-[14px] leading-relaxed font-medium transition-colors duration-300 ${
            isSender 
              ? 'bg-[#2D4F2B] text-white rounded-2xl rounded-tr-none shadow-[#2D4F2B]/10' 
              : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200/60 dark:border-slate-700/50 rounded-2xl rounded-tl-none'
          }`}
        >
          <p className="whitespace-pre-wrap break-words">
            {message.message}
          </p>
        </div>
        
        {/* Timestamp - Refined for High Fidelity */}
        <span className="text-[9px] mt-1.5 text-slate-400 dark:text-slate-500 px-1 uppercase font-black tracking-[0.15em] leading-none">
          {formatTime(message.created_at)}
        </span>
      </div>
    </motion.div>
  );
}