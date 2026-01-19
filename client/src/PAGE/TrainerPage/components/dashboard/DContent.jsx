import React,{useState, useEffect} from 'react'
import SchoolIcon from '@mui/icons-material/School';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import BarChartIcon from '@mui/icons-material/BarChart';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import PeopleIcon from '@mui/icons-material/People';


export default function Content(props) {

  const [gretting ,setGretting] = useState("")
 
  function getgreeting (){
     const hour = new Date().getHours();
      if (hour >= 5 && hour < 12) {
      return setGretting("Good Morning Trainer");
    } else if (hour >= 12 && hour < 17) {
      return setGretting("Good Afternoon Trainer");
    } else if (hour >= 17 && hour < 21) {
      return setGretting("Good Evening Trainer");
    } else {
      return setGretting("Good Night Trainer");
    }
  }
  useEffect(()=>{
      getgreeting()
  },[])

  return (
   
    <div
  className="
    w-full h-50
    rounded-lg
    flex p-5
    bg-white/10
    backdrop-blur-md
    border border-black/5
    shadow-xl
  "
  style={{ boxShadow: "3px 3px 5px rgba(0,0,0,0.1)" }}
>
  <div className="w-180 h-full flex items-center gap-8">
    <section>
      <h1 className='text-3xl m-2 font-bold text-[#2D4F2B]'>{gretting}</h1>
      <h1 className='text-2xl m-2 font-semibold text-[#2D4F2B]'>WELCOME to E-Kabuhayan!</h1>
    </section>

    <section className="h-40 w-35 bg-white/10 backdrop-blur-md border border-black/10 text-[#2D4F2B] rounded-3xl flex justify-center items-center flex-col shadow">
      <div className="w-13 h-13 grid place-items-center bg-white/20 rounded-full">
        <SchoolIcon fontSize="large" />
      </div>
      <p className="text-4xl font-bold m-2 text-[#FFB823]">{props.traineeCount}</p>
      <p className="font-medium">Total Trainee</p>
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