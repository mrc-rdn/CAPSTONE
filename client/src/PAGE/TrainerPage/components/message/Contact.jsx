import React from 'react'

export default function Contact(props) {
  const colorMap = {
    red: { 200: 'bg-red-200', 300: 'bg-red-300', 400: 'bg-red-400', 500: 'bg-red-500', 600: 'bg-red-600', 700: 'bg-red-700', 800: 'bg-red-800' },
    yellow: { 200: 'bg-yellow-200', 300: 'bg-yellow-300', 400: 'bg-yellow-400', 500: 'bg-yellow-500', 600: 'bg-yellow-600', 700: 'bg-yellow-700', 800: 'bg-yellow-800' },
    green: { 200: 'bg-green-200', 300: 'bg-green-300', 400: 'bg-green-400', 500: 'bg-green-500', 600: 'bg-green-600', 700: 'bg-green-700', 800: 'bg-green-800' },
    orange: { 200: 'bg-orange-200', 300: 'bg-orange-300', 400: 'bg-orange-400', 500: 'bg-orange-500', 600: 'bg-orange-600', 700: 'bg-orange-700', 800: 'bg-orange-800' },
    blue: { 200: 'bg-blue-200', 300: 'bg-blue-300', 400: 'bg-blue-400', 500: 'bg-blue-500', 600: 'bg-blue-600', 700: 'bg-blue-700', 800: 'bg-blue-800' },
    purple: { 200: 'bg-purple-200', 300: 'bg-purple-300', 400: 'bg-purple-400', 500: 'bg-purple-500', 600: 'bg-purple-600', 700: 'bg-purple-700', 800: 'bg-purple-800' },
    pink: { 200: 'bg-pink-200', 300: 'bg-pink-300', 400: 'bg-pink-400', 500: 'bg-pink-500', 600: 'bg-pink-600', 700: 'bg-pink-700', 800: 'bg-pink-800' },
  }

  const userColorClass = colorMap[props.color]?.[props.shade] || 'bg-gray-500';

  return (
    <div
      className={
        props.isActive
          ? "w-full h-16 flex items-center px-4 mb-2 rounded-2xl bg-emerald-600 text-white shadow-lg shadow-emerald-200/50 transition-all duration-200 scale-[1.02]"
          : "w-full h-16 flex items-center px-4 mb-2 rounded-2xl bg-white/50 hover:bg-white border border-slate-200/60 transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md"
      }
      onClick={props.handleSelectContact}
    >
      <div className="relative flex-shrink-0">
        {props.profile ? (
          <img
            src={props.profile}
            alt=""
            className={`w-11 h-11 rounded-full border-2 object-cover ${props.isActive ? 'border-white/40' : 'border-emerald-100'}`}
          />
        ) : (
          <div
            className={`w-11 h-11 rounded-full flex items-center justify-center ${userColorClass} text-white font-bold border-2 ${props.isActive ? 'border-white/40' : 'border-white/20'}`}
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
        <p className={`text-[10px] font-bold uppercase tracking-wider truncate ${props.isActive ? 'text-emerald-50' : 'text-slate-400'}`}>
          {props.isActive ? 'Active Chat' : 'View Message'}
        </p>
      </div>
    </div>
  );
}