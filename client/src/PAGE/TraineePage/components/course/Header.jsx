import React, {useState, useEffect} from 'react'
import { Link } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import axios from 'axios'
import { API_URL } from '../../../../api';
import CircularProgress from '@mui/material/CircularProgress';



export default function Header(props) {
  const [notifications, setNotificaitons] = useState(0)
   const [progress, setProgress] = useState([])
    
     function deslugify(slug) {
        // 1. Replace hyphens with spaces
        // 2. Capitalize first letter of each word (optional)
        return slug
            .replace(/-/g, ' ')               // replace - with space
            .replace(/\b\w/g, char => char.toUpperCase()); // capitalize each word
    }

    useEffect(()=>{
      const fetchData= async()=>{
        const [result,  progress ] = await Promise.all([ axios.get(`${API_URL}/admin/announcement/${props.courseId}/notificaitons`,{withCredentials:true}),
          axios.get(`${API_URL}/trainee/traineeprogress/${props.courseId}`, { withCredentials: true }),  
         ])
      
         setProgress(progress.data.data)
        setNotificaitons(result.data.totalNotif)
      } 
      fetchData()
    },[props.refresh])

  function getCompletionPercentagePerUser(data) {
    const users = {};

    data.forEach(item => {
      const userId = item.user_id;

      if (!users[userId]) {
        users[userId] = {
          user_id: userId,
          first_name: item.first_name,
          surname: item.surname,
          total: 0,
          done: 0
        };
      }

      users[userId].total += 1;

      if (item.is_done) {
        users[userId].done += 1;
      }
    });

    // Step 2: compute percentage
    return Object.values(users).map(user => ({
      ...user,
      percentage: Math.round((user.done / user.total) * 100)
    }));
  }
  let result = getCompletionPercentagePerUser(progress);

    
  return (
    <div className="flex w-full h-full bg-green-700 items-center text-white ">
        <Link to="/trainee/course">
            <button className="ml-5 text-sm sm:text-lg">
            <ArrowBackIcon />
            </button>

        </Link>

        <h1 className="text-sm sm:text-xl font-medium ml-10">{deslugify(props.courseTitle)}</h1>
        <div className='relative ml-auto flex items-center mr-3'>
          <CircularProgress  variant="determinate" value={result[0]?.percentage} />
          <span className='absolute top-3 left-2.5 text-xs'>{result?result[0]?.percentage: '0'}%</span>
          <h1 className='ml-3'>Your Progress</h1>
        </div>
        <div className=' relative'>
          <button
          onClick={() => {props.handleOpenAnnouncementModal(notifications)}}
          className=" m-3 p-3  m-3 hover:border-b-3 p-3 transition-all duration-80 ease-in-out"
            >
          Announcement
          </button>
          {notifications >= 1 && <div className='w-4 h-4 bg-red-500 rounded-full absolute top-4 right-3  '>
            <span className='text-[10px] absolute left-[5px] top-[1px]'>
                {notifications}
            </span>

          </div>}
          

        </div>
        
       

    </div>
      
  )
}
