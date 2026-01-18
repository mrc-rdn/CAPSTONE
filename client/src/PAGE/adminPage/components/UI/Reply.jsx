import React from 'react'
import DeleteIcon from "@mui/icons-material/Delete";
import { API_URL } from '../../../../api';
import axios from 'axios';

export default function Reply({replyUserId , replyId, first_name,surname, profile, shade, color, content, userId, handleRefresh}) {
  console.log(replyId)

  const deleteReply = async ()=>{
    const fetch = await axios.post(`${API_URL}/admin/deletereply/${replyId}`,{},{withCredentials:true})
  }
  const colorMap = {
    red: {200: 'bg-red-200',300: 'bg-red-300',400: 'bg-red-400',500: 'bg-red-500',600: 'bg-red-600',700: 'bg-red-700', 800: 'bg-red-800'},
    yellow: {200: 'bg-yellow-200',300: 'bg-yellow-300',400: 'bg-yellow-400',500: 'bg-yellow-500',600: 'bg-yellow-600',700: 'bg-yellow-700',800: 'bg-yellow-800'},
    green: {200: 'bg-green-200',300: 'bg-green-300',400: 'bg-green-400',500: 'bg-green-500',600: 'bg-green-600',700: 'bg-green-700',800: 'bg-green-800'},
    orange: {200: 'bg-orange-200',300: 'bg-orange-300',400: 'bg-orange-400',500: 'bg-orange-500',600: 'bg-orange-600',700: 'bg-orange-700',800: 'bg-orange-800'},
    blue: {200: 'bg-blue-200',300: 'bg-blue-300',400: 'bg-blue-400',500: 'bg-blue-500',600: 'bg-blue-600',700: 'bg-blue-700',800: 'bg-blue-800'},
    purple: {200: 'bg-purple-200',300: 'bg-purple-300',400: 'bg-purple-400',500: 'bg-purple-500',600: 'bg-purple-600',700: 'bg-purple-700',800: 'bg-purple-800'},
    pink: {200: 'bg-pink-200',300: 'bg-pink-300',400: 'bg-pink-400',500: 'bg-pink-500',600: 'bg-pink-600',700: 'bg-pink-700',800: 'bg-pink-800'},
  }

 const userColorClass = colorMap[color]?.[shade] || 'bg-gray-500';


 
  
 return (
  <div className="flex gap-3 mt-4">

    {/* Avatar */}
    <div className="flex-shrink-0">
      {profile ? (
        <img
          src={profile}
          alt=""
          className="w-8 h-8 rounded-full object-cover"
        />
      ) : (
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-semibold ${userColorClass}`}
        >
          {first_name.slice(0, 1).toUpperCase()}
        </div>
      )}
    </div>

    {/* Reply content */}
    <div className="flex-1">

      {/* Name */}
      <div className="flex items-center gap-2">
        <span className="font-semibold text-sm text-gray-900">
          {first_name} {surname}
        </span>
      </div>

      {/* Reply text */}
      <p className="text-sm text-gray-800 mt-1 leading-relaxed break-words">
        {content}
      </p>


    </div>
    {replyUserId === userId && 
    <button
      className="ml-auto text-gray-500 hover:text-red-600 transition"
      onClick={(e) => {  
        handleRefresh() 
        deleteReply()
      }}
    >
      <DeleteIcon fontSize="small" />
    </button>}
   
  </div>
);
}
