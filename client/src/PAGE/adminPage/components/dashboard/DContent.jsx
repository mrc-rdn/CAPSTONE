import React from 'react'
import SchoolIcon from '@mui/icons-material/School';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import BarChartIcon from '@mui/icons-material/BarChart';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import PeopleIcon from '@mui/icons-material/People';


export default function Content(props) {
  return (
   
    <div
  className="
    w-full h-50
    rounded-xl
    flex p-5
    bg-white/10
    backdrop-blur-md
    border border-black/5
    shadow-xl
  "
  style={{ boxShadow: "3px 3px 5px rgba(0,0,0,0.1)" }}
>
  <div className="w-180 h-full flex justify-center items-center gap-8">

    <section className="h-40 w-35 bg-white/10 backdrop-blur-md border border-black/10 text-[#2D4F2B] rounded-3xl flex justify-center items-center flex-col shadow">
      <div className="w-13 h-13 grid place-items-center bg-white/20 rounded-full">
        <SchoolIcon fontSize="large" />
      </div>
      <p className="text-4xl font-bold m-2 text-[#FFB823]">{props.traineeCount}</p>
      <p className="font-medium">Total Trainee</p>
    </section>

    <section className="h-40 w-35 bg-white/10 backdrop-blur-md border border-black/10 text-[#2D4F2B] rounded-3xl flex justify-center items-center flex-col shadow">
      <div className="w-13 h-13 grid place-items-center bg-white/20 rounded-full">
        <BarChartIcon fontSize="large" />
      </div>
      <p className="text-4xl font-bold m-2 text-[#FFB823]">{props.trainerCount}</p>
      <p className="font-medium">Total Trainer</p>
    </section>

    <section className="h-40 w-35 bg-white/10 backdrop-blur-md border border-black/10 text-[#2D4F2B] rounded-3xl flex justify-center items-center flex-col shadow">
      <div className="w-13 h-13 grid place-items-center bg-white/20 rounded-full">
        <PeopleIcon fontSize="large" />
      </div>
      <p className="text-4xl font-bold m-2 text-[#FFB823]">{props.trainerCount+ props.traineeCount}</p>
      <p className="font-medium">Total User</p>
    </section>

    <section className="h-40 w-35 bg-white/10 backdrop-blur-md border border-black/10 text-[#2D4F2B] rounded-3xl flex justify-center items-center flex-col shadow">
      <div className="w-13 h-13 grid place-items-center bg-white/20 rounded-full">
        <MenuBookIcon fontSize="large" />
      </div>
      <p className="text-4xl font-bold m-2 text-[#FFB823]">{props.coursesCount}</p>
      <p className="font-medium">Active Courses</p>
    </section>

  </div>
</div>

    
  )
}