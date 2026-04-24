import React from 'react';
import { motion } from 'framer-motion';

export default function Messages({ message, userData }) {
  // Checks if current user is the sender
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
      className={`w-full flex ${isSender ? 'justify-end' : 'justify-start'} my-2`}
    >
      <div className={`flex flex-col ${isSender ? 'items-end' : 'items-start'} max-w-[75%]`}>
        <div 
          className={`px-4 py-2.5 shadow-sm relative text-[14px] leading-relaxed font-medium ${
            isSender 
              ? 'bg-[#2D4F2B] text-white rounded-2xl rounded-tr-none shadow-emerald-100/20' 
              : 'bg-white text-slate-700 border border-slate-200/60 rounded-2xl rounded-tl-none'
          }`}
        >
          <p className="whitespace-pre-wrap break-words">
            {message.message}
          </p>
        </div>
        
        <span className="text-[9px] mt-1 text-slate-400 px-1 uppercase font-black tracking-widest">
          {formatTime(message.created_at)}
        </span>
      </div>
    </motion.div>
  );
}