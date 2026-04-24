import React from 'react'

export default function UpcomingEvents({ text, eventDate, color }) {
  // Array of months for indexing
  const monthsShort = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

  // Parse the incoming date string
  const date = new Date(eventDate)
  const monthIndex = date.getMonth()
  const day = date.getDate()

  // Find the label for the month
  const foundMonth = monthsShort[monthIndex]

  return (
    <div
      className="
        w-full
        max-w-full
        my-3 m-1 p-3
        flex flex-row items-center gap-3
        rounded-xl
        backdrop-blur-md
        bg-white/30
        dark:bg-slate-800/40
        border border-white/30
        dark:border-slate-700
        shadow-sm
        dark:shadow-none
        transition-all duration-300
        hover:bg-white/50
        dark:hover:bg-slate-800/60
      "
    >
      {/* Date Badge */}
      <div
        className="
          w-11 h-11
          flex flex-col items-center justify-center
          rounded-lg
          text-white
          font-semibold
          shadow-inner
          flex-shrink-0
        "
        style={{ backgroundColor: color }}
      >
        <p className="text-sm leading-none">{day}</p>
        <p className="text-[10px] opacity-95 font-black uppercase tracking-tighter">
          {foundMonth}
        </p>
      </div>

      {/* Event Text */}
      <p className="
        flex-1
        text-sm
        text-gray-700
        dark:text-slate-300
        font-medium
        break-words
        line-clamp-2
      ">
        {text}
      </p>
    </div>
  )
}