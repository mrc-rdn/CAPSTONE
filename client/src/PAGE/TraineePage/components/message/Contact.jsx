import React from 'react'

export default function Contact(props) {
  const colorMap = {
    red: { 500: 'bg-red-500' }, yellow: { 500: 'bg-yellow-500' },
    green: { 500: 'bg-green-500' }, orange: { 500: 'bg-orange-500' },
    blue: { 500: 'bg-blue-500' }, purple: { 500: 'bg-purple-500' },
    pink: { 500: 'bg-pink-500' },
  }

  const userColorClass = colorMap[props.color]?.[props.shade || 500] || 'bg-slate-500';

  return (
    <div
      className={
        props.isActive
          ? "w-full h-16 flex items-center px-4 mb-2 rounded-2xl bg-[#2D4F2B] text-white shadow-lg shadow-[#2D4F2B]/20 transition-all duration-200 scale-[1.02]"
          : "w-full h-16 flex items-center px-4 mb-2 rounded-2xl bg-white/50 hover:bg-white border border-slate-200/60 transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md group"
      }
      onClick={props.handleSelectContact}
    >
      <div className="relative flex-shrink-0">
        {props.profile ? (
          <img
            src={props.profile}
            alt=""
            className={`w-11 h-11 rounded-full border-2 object-cover transition-transform group-hover:scale-105 ${props.isActive ? 'border-white/40' : 'border-[#2D4F2B]/10'}`}
          />
        ) : (
          <div
            className={`w-11 h-11 rounded-full flex items-center justify-center ${userColorClass} text-white font-bold border-2 transition-transform group-hover:scale-105 ${props.isActive ? 'border-white/40' : 'border-white/20'}`}
          >
            <p className="text-sm">{props.firstName?.slice(0, 1).toUpperCase()}</p>
          </div>
        )}

        {props.unread_count > 0 && (
          <span className="min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] rounded-full absolute -top-1 -right-1 flex items-center justify-center shadow-lg border-2 border-white px-1 font-black">
            {props.unread_count}
          </span>
        )}
      </div>

      <div className="flex flex-col ml-3 overflow-hidden">
        <p className={`font-black text-sm truncate tracking-tight ${props.isActive ? 'text-white' : 'text-slate-800'}`}>
          {props.firstName} {props.surname}
        </p>
        <p className={`text-[10px] font-bold uppercase tracking-wider truncate ${props.isActive ? 'text-white/80' : 'text-slate-400'}`}>
          {props.isActive ? 'Active Chat' : 'View Message'}
        </p>
      </div>
    </div>
  );
}