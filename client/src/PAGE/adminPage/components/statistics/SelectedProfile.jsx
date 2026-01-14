import React, {useEffect, useState} from 'react'
import {Link, Navigate} from 'react-router-dom'
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
import { API_URL } from '../../../../api.js';


export default function SelectedProfile(props) {
    const exit = false
    const [id, setId] = useState("");
    const [isContactAdded, setIsContactAdded] = useState(false)
    const [isAdded, setIsAdded] = useState("")
  
    const [isMouseOver, setMouseOver] = useState(false)
    const handleExit = ()=>{
      props.onExit(exit)
    } 
    const handleSubmit = async(e) =>{
      e.preventDefault();
    
    }



 return (
  <div className="w-full h-full bg-black/40 backdrop-blur-sm fixed inset-0 flex items-center justify-center z-1000">
    <div className="w-4/12 bg-white rounded-2xl shadow-xl p-6">

      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <button
          onClick={handleExit}
          className="p-2 rounded-full hover:bg-gray-100 transition"
        >
          <CloseIcon />
        </button>
          
       
      </div>
<h1 className="text-2xl font-semibold text-gray-800 mb-4">
        Profile
      </h1>
    

      {/* Profile */}
      <div className="flex items-center gap-5">
        {props.profile ? (
          <img
            src={props.profile}
            alt=""
            className="w-28 h-28 rounded-full object-cover border border-gray-300"
          />
        ) : (
          <div
            className={`w-28 h-28 rounded-full flex items-center justify-center text-white text-3xl font-bold ${props.userColorClass}`}
          >
            {props.firstName.slice(0, 1).toUpperCase()}
          </div>
        )}

        <div className="flex flex-col">
          <p className="text-xl font-semibold text-gray-900">
            {props.firstName} {props.surname}
          </p>

          <p className="text-sm text-gray-500 mt-1">
            username: {props.username}
          </p>

          <p className="text-xs text-gray-400">
            ID: {props.id}
          </p>
        </div>
      </div>
    </div>
  </div>
);
}