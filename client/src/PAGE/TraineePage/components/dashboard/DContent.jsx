import React from 'react'
import SchoolIcon from '@mui/icons-material/School';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import BarChartIcon from '@mui/icons-material/BarChart';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import PeopleIcon from '@mui/icons-material/People';


export default function Content(props) {
  return (
   
    <div className='w-full h-50 bg-green-700 rounded-lg flex p-5 shadow-xl border-2 border-gray-200'
    style={{boxShadow: "3px 3px 5px rgba(0,0,0,0.1)"}}>
        
        <div className='w-180 h-full flex justify-center items-center gap-8 '>
            <section className='h-40 w-35 bg-green-600/90 border border-emerald-500/30 text-white rounded-3xl border-white border flex justify-center items-center flex-col shadow'>
                <div className='w-13 h-13 grid place-items-center bg-white/20 rounded-full text-white '><SchoolIcon fontSize='large' /></div>
                <p className='text-4xl font-bold m-2 text-yellow-400'>{props.traineeCount}</p>
                <p className='font-medium'>Total Trainee</p>
            </section>
            <section className='h-40 w-35 bg-green-600/90 border border-emerald-500/30 text-white rounded-3xl border-white border flex justify-center items-center flex-col shadow'>
                <div className='w-13 h-13 grid place-items-center bg-white/20 rounded-full text-white '><BarChartIcon fontSize='large' /></div>
                <p className='text-4xl font-bold m-2 text-yellow-400'>{props.trainerCount}</p>
                <p className='font-medium'>Total Trainer</p>
            </section>
            <section className='h-40 w-35 bg-green-600/90 border border-emerald-500/30 text-white rounded-3xl border-white border flex justify-center items-center flex-col'>
                <div className='w-13 h-13 grid place-items-center bg-white/20 rounded-full '><PeopleIcon fontSize='large' /></div>
                <p className='text-4xl font-bold m-2 text-yellow-400'>{props.trainerCount}</p>
                <p className='font-medium'>Total User</p>
            </section>
            <section className='h-40 w-35 bg-green-600/90 border border-emerald-500/30 text-white rounded-3xl border-white border flex justify-center items-center flex-col'>
                <div className='w-13 h-13 grid place-items-center bg-white/20 rounded-full '><MenuBookIcon fontSize='large' /></div>
                <p className='text-4xl font-bold m-2 text-yellow-400'>{props.coursesCount}</p>
                <p className='font-medium'>Active Courses</p>
            </section>
            
        </div>
        
        
    </div>   
    
  )
}
