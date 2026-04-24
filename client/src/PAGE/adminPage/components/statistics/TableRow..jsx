import React, { useState } from 'react';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import LinearProgress from '@mui/material/LinearProgress';

export default function TableRow(props) {
  const [isOpen, setIsOpen] = useState(false);

  const colorMap = {
    red: 'bg-red-500', yellow: 'bg-yellow-500', green: 'bg-emerald-500',
    orange: 'bg-orange-500', blue: 'bg-blue-500', purple: 'bg-purple-500', pink: 'bg-pink-500',
  };

  const userColorClass = colorMap[props.color] || 'bg-slate-500';
  const result = props.result.filter((info) => info.user_id === props.id);

  return (
    <>
      <tr className="group hover:bg-emerald-50/50 dark:hover:bg-emerald-900/10 transition-all duration-300 border-b border-slate-50 dark:border-slate-800/50">
        <td className="py-5 px-4 text-center">
          <span className="text-[11px] font-black text-slate-400 group-hover:text-emerald-600 transition-colors">
            {String(props.index + 1).padStart(2, '0')}
          </span>
        </td>

        <td className="py-5 px-6">
          <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 tracking-wider">
            #{props.id}
          </span>
        </td>

        <td className="py-5 px-6">
          <div className="flex items-center gap-3">
             <div className={`w-8 h-8 rounded-lg ${userColorClass} bg-opacity-20 flex items-center justify-center`}>
                <span className={`text-[10px] font-black ${userColorClass.replace('bg-', 'text-')}`}>
                    {props.first_name[0]}{props.surname[0]}
                </span>
             </div>
             <p className="text-sm font-black text-slate-700 dark:text-slate-200 uppercase tracking-tight">
                {props.surname}, {props.first_name}
             </p>
          </div>
        </td>

        <td className="py-5 px-6 text-center">
          <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
            props.role === 'TRAINER' 
            ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' 
            : 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400'
          }`}>
            {props.role}
          </span>
        </td>

        <td className="py-5 px-6 text-center">
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className={`p-1.5 rounded-xl transition-all duration-300 ${
              isOpen 
              ? 'bg-slate-900 text-white rotate-180' 
              : 'bg-slate-100 dark:bg-slate-800 text-slate-400 hover:bg-emerald-500 hover:text-white'
            }`}
          >
            <KeyboardArrowDownIcon sx={{ fontSize: 18 }} />
          </button>
        </td>
      </tr>

      {/* EXPANDED SECTION */}
      {isOpen && (
        <tr className="bg-slate-50/50 dark:bg-slate-900/40">
          <td colSpan="5" className="p-8">
            <div className="flex flex-col lg:flex-row items-center gap-10 animate-in fade-in slide-in-from-top-2 duration-300">
              
              {/* Profile Bio */}
              <div className="flex items-center gap-6 min-w-[300px]">
                {props.profile ? (
                  <img
                    src={props.profile}
                    alt=""
                    className="w-24 h-24 rounded-3xl object-cover border-4 border-white dark:border-slate-800 shadow-xl"
                  />
                ) : (
                  <div className={`w-24 h-24 rounded-3xl flex items-center justify-center text-white text-3xl font-black shadow-lg ${userColorClass}`}>
                    {props.first_name[0]}
                  </div>
                )}
                <div>
                  <h4 className="text-lg font-black text-slate-800 dark:text-white leading-tight uppercase">
                    {props.first_name} {props.surname}
                  </h4>
                  <p className="text-xs font-bold text-emerald-600 dark:text-emerald-500 uppercase tracking-widest mt-1">@{props.username || 'user'}</p>
                  <div className="mt-3 flex gap-2">
                     <div className="px-2 py-1 bg-slate-200 dark:bg-slate-800 rounded text-[9px] font-black text-slate-500 uppercase">UID: {props.id}</div>
                  </div>
                </div>
              </div>

              {/* Progress Card */}
              {result[0] && (
                <div className="flex-1 w-full bg-white dark:bg-slate-800 rounded-[2rem] p-6 shadow-xl border border-slate-100 dark:border-slate-700/50">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Active Course</p>
                      <h5 className="text-sm font-black text-slate-800 dark:text-white uppercase">{result[0]?.courseTitle}</h5>
                    </div>
                    <span className={`text-[10px] font-black px-2 py-1 rounded-lg ${
                      result[0]?.percentage === 100 ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-100 text-blue-600'
                    }`}>
                      {result[0]?.percentage === 100 ? 'COMPLETED' : 'IN PROGRESS'}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-end">
                      <span className="text-[10px] font-black text-slate-400 uppercase">Syllabus Progress</span>
                      <span className="text-xs font-black text-slate-800 dark:text-white">{result[0]?.percentage}%</span>
                    </div>
                    <LinearProgress
                      variant="determinate"
                      value={result[0]?.percentage}
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: "rgba(0,0,0,0.05)",
                        "& .MuiLinearProgress-bar": {
                          backgroundColor: result[0]?.percentage === 100 ? "#10b981" : "#3b82f6",
                          borderRadius: 4
                        },
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          </td>
        </tr>
      )}
    </>
  );
}