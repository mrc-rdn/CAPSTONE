import React,{useState} from 'react'

export default function UpcomingEvents({text, eventDate, color}) {
    const [month, setMonth] = useState("")
    const monthsShort = ["Jan", "Feb", "Mar", "Apr", "May", "Jun","Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    const date = new Date (eventDate)
    const months = date.getMonth()
    const day = date.getDate();

    const found = monthsShort.find((month, index)=> index === months )
    
    console.log(found)
console.log(color)


  return (
    <div className='w-[330px] bg-white my-3 rounded-lg flex-row flex p-2 shadow-xl m-1 border-2 border-gray-200'
    style={{boxShadow: "3px 3px 5px rgba(0,0,0,0.1)"}}>
        <div className='w-11 h-11 flex flex-col items-center rounded '
        style={{backgroundColor: color ,  }}>
            
            <p className='mx-1  text-sm font-bold'>{day}</p>
            
            <p className='text-sm'>{found}</p>
        </div>
      <p className='w-65 break-words p-2'>{text}</p>
    </div>
  )
}
