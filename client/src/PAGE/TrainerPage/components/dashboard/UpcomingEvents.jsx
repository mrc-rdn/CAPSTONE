import React,{useState} from 'react'

export default function UpcomingEvents({text, eventDate, color}) {
    const [month, setMonth] = useState("")
    const monthsShort = ["Jan", "Feb", "Mar", "Apr", "May", "Jun","Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

    const date = new Date(eventDate)
    const months = date.getMonth()
    const day = date.getDate()

    const found = monthsShort.find((month, index)=> index === months)
console.log(found)
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
    transition-colors duration-300
  "
>
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
    <p className="text-xs opacity-90 font-black uppercase tracking-tighter">{found}</p>
  </div>

  <p className="
      flex-1
      text-sm
      text-gray-700
      dark:text-slate-300
      font-medium
      break-words
    ">
    {text}
  </p>
</div>

  )
}