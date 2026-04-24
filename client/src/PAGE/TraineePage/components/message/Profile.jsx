import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import SelectedProfile from './SelectedProfile';

export default function Profile(props) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Simplified colorMap to match Trainer's clean structure
  const colorMap = {
    red: { 500: 'bg-red-500' }, 
    yellow: { 500: 'bg-yellow-500' },
    green: { 500: 'bg-green-500' }, 
    orange: { 500: 'bg-orange-500' },
    blue: { 500: 'bg-blue-500' }, 
    purple: { 500: 'bg-purple-500' },
    pink: { 500: 'bg-pink-500' },
  };

  const userColorClass = colorMap[props.color]?.[props.shade] || 'bg-slate-500';

  const handleExitModal = (exit) => {
    if (props.refresh) props.refresh();
    setIsModalOpen(exit);
  };

  const handleSelect = () => {
    if (props.onSelect) {
      props.onSelect();
    } else {
      setIsModalOpen(true);
    }
  };

  return (
    <div className="px-2">
      <li
        className="w-full h-16 flex items-center gap-4 px-4 cursor-pointer rounded-2xl hover:bg-white/60 dark:hover:bg-slate-800/50 border border-transparent hover:border-slate-200/60 dark:hover:border-slate-700/50 transition-all group"
        onClick={handleSelect}
      >
        {/* Avatar Area with Squircle Design */}
        <div className="relative shrink-0">
          {props.profile ? (
            <img
              src={props.profile}
              alt=""
              className="w-10 h-10 rounded-xl border border-slate-200 dark:border-slate-700 object-cover group-hover:scale-105 transition-transform"
            />
          ) : (
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm font-black shadow-sm group-hover:scale-105 transition-transform ${userColorClass}`}>
              {props.firstName?.slice(0, 1).toUpperCase()}
            </div>
          )}
        </div>

        {/* Text Content */}
        <div className="flex flex-col overflow-hidden">
          <p className="text-sm font-black text-slate-800 dark:text-slate-100 tracking-tight truncate">
            {props.firstName} {props.surname}
          </p>
          <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-none">
            @{props.username}
          </p>
        </div>
      </li>

      {/* Modal Logic */}
      {isModalOpen && createPortal(
        <SelectedProfile
          onExit={handleExitModal}
          id={props.id}
          username={props.username}
          firstName={props.firstName}
          surname={props.surname}
          profile={props.profile}
          userColorClass={userColorClass}
        />,
        document.body
      )}
    </div>
  );
}