import React from 'react'
import SchoolIcon from '@mui/icons-material/School';
import GroupsIcon from '@mui/icons-material/Groups';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import BarChartIcon from '@mui/icons-material/BarChart';

export default function Content(props) {
  return (
    <div className='w-full h-70 flex justify-center items-center'>
        <div className='w-11/12 h-50 bg-green-700 rounded-xl flex'>
            <div className='w-110 h-50 flex justify-center items-center p-10 font-bold text-white'>
                <h1 className='text-3xl '>Good morning, PLRMO Admin</h1>
            </div>
            <div className='w-180 h-50 flex justify-center items-center gap-8'>
                <section className='h-40 w-35  bg-white/10 border border-emerald-500/30 text-white rounded-xl border-white border flex justify-center items-center flex-col'>
                    <div className='w-13 h-13 grid place-items-center bg-white/20 rounded-full '><GroupsIcon fontSize='large' /></div>
                    <p className='text-4xl font-bold m-2'>{props.traineeCount}</p>
                    <p className='font-medium'>Total Trainee</p>
                </section>
                <section className='h-40 w-35  bg-white/10 border border-emerald-500/30 text-white rounded-xl border-white border flex justify-center items-center flex-col'>
                    <div className='w-13 h-13 grid place-items-center bg-white/20 rounded-full '><BarChartIcon /></div>
                    <p className='text-4xl font-bold m-2'>{props.trainerCount}</p>
                    <p className='font-medium'>Total Trainer</p>
                </section>
                <section className='h-40 w-35  bg-white/10 border border-emerald-500/30 text-white rounded-xl border-white border flex justify-center items-center flex-col'>
                    <div className='w-13 h-13 grid place-items-center bg-white/20 rounded-full '><SchoolIcon /></div>
                    <p className='text-4xl font-bold m-2'>{props.coursesCount}</p>
                    <p className='font-medium'>Active Courses</p>
                </section>
                
            </div>
            
            
        </div>   
    </div>
  )
}
