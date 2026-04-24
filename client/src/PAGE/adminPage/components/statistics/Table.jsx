import React, { useState } from 'react';
import TableRow from './TableRow.';

export default function Table(props) {
  // Shared text style for table headers to match dashboard typography
  const thClass = "py-4 px-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 border-b border-slate-100 dark:border-slate-800";

  return (
    <div className="w-full h-[500px] overflow-y-auto custom-scrollbar relative px-2">
      <table className="w-full border-separate border-spacing-0">
        {/* STICKY HEADER */}
        <thead className="sticky top-0 z-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md">
          <tr>
            <th className={`${thClass} text-center w-16 rounded-tl-2xl`}>#</th>
            <th className={`${thClass} text-left`}>User Identity</th>
            <th className={`${thClass} text-left`}>Full Name</th>
            <th className={`${thClass} text-center`}>System Role</th>
            <th className={`${thClass} text-center rounded-tr-2xl`}>Action</th>
          </tr>
        </thead>

        {/* TABLE BODY */}
        <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
          {props.list.length > 0 ? (
            props.list.map((info, index) => (
              <TableRow
                key={index}
                index={index}
                id={info.id}
                first_name={info.first_name}
                surname={info.surname}
                role={info.role}
                profile={info.profile_pic}
                color={info.color}
                shade={info.shades}
                result={props.result}
                info={info}
              />
            ))
          ) : (
            <tr>
              <td colSpan="5" className="py-20 text-center">
                <p className="text-xs font-black uppercase tracking-widest text-slate-300 dark:text-slate-700">
                  No records found in master list
                </p>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}