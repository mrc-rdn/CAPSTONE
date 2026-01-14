import React, {useState, useEffect} from 'react'
import SchoolIcon from '@mui/icons-material/School';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import BarChartIcon from '@mui/icons-material/BarChart';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import PeopleIcon from '@mui/icons-material/People';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
import { API_URL } from '../../../../api';



export default function Content(props) {
    const [announcement, setAnnouncement] = useState([]);
   
    const fectchdata = async()=>{
      const fetch = await axios.get(`${API_URL}/trainee/announcement/${props.courseId.id}`, {withCredentials:true})
      setAnnouncement(fetch.data)
          
    }

    

    useEffect(() => {
      
      fectchdata()

    }, [props.courseId]);
   
     console.log(announcement)
 const colorMap = {
    red: {200: 'bg-red-200',300: 'bg-red-300',400: 'bg-red-400',500: 'bg-red-500',600: 'bg-red-600',700: 'bg-red-700', 800: 'bg-red-800'},
    yellow: {200: 'bg-yellow-200',300: 'bg-yellow-300',400: 'bg-yellow-400',500: 'bg-yellow-500',600: 'bg-yellow-600',700: 'bg-yellow-700',800: 'bg-yellow-800'},
    green: {200: 'bg-green-200',300: 'bg-green-300',400: 'bg-green-400',500: 'bg-green-500',600: 'bg-green-600',700: 'bg-green-700',800: 'bg-green-800'},
    orange: {200: 'bg-orange-200',300: 'bg-orange-300',400: 'bg-orange-400',500: 'bg-orange-500',600: 'bg-orange-600',700: 'bg-orange-700',800: 'bg-orange-800'},
    blue: {200: 'bg-blue-200',300: 'bg-blue-300',400: 'bg-blue-400',500: 'bg-blue-500',600: 'bg-blue-600',700: 'bg-blue-700',800: 'bg-blue-800'},
    purple: {200: 'bg-purple-200',300: 'bg-purple-300',400: 'bg-purple-400',500: 'bg-purple-500',600: 'bg-purple-600',700: 'bg-purple-700',800: 'bg-purple-800'},
    pink: {200: 'bg-pink-200',300: 'bg-pink-300',400: 'bg-pink-400',500: 'bg-pink-500',600: 'bg-pink-600',700: 'bg-pink-700',800: 'bg-pink-800'},
  }
    


  return (    
    <div className="w-full h-full  rounded-xl
    
    
    backdrop-blur-md
    bg-white/30
    border border-white/30
    shadow-sm
    flex flex-col
    justify-between
    transition
    hover:shadow-md">

      {/* ===== HEADER ===== */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-[#6F8A6A]/40">
        <h1 className="text-xl font-semibold text-[#2D4F2B]">
          Announcements
        </h1>
        
      </div>

      {/* ===== BODY ===== */}
      <div className="flex-1 overflow-y-auto px-6 py-4">      

        {/* ===== ANNOUNCEMENT LIST ===== */}
        {announcement.map((item, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-md p-5 mb-4"
          >
            <div className="flex items-center mb-3">
              {item.profile_pic ? (
                <img
                  src={item.profile_pic}
                  alt=""
                  className="w-11 h-11 rounded-full border"
                />
              ) : (
                <div
                  className={`w-11 h-11 rounded-full flex items-center justify-center text-white font-bold 
                    ${colorMap[item.color]?.[item.shades] || "bg-gray-500"}`}
                >
                  {item.first_name.slice(0, 1)}
                </div>
              )}

              <div className="ml-3">
                <p className="font-semibold text-gray-800">
                  {item.first_name} {item.surname}
                </p>
              </div>

            </div>

            <h2 className="text-lg font-bold text-gray-800 mb-2">
              {item.title}
            </h2>

            <p className="text-gray-600 break-words">
              {item.message}
            </p>
          </div>
        ))}
      </div>

    </div>
  
 )
}
