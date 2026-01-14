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
      try {
        const addNewContacts = await axios.post(`${API_URL}/admin/addContact`,{user2_id: props.id }, {withCredentials:true})
        let message = addNewContacts.data.message
        setIsContactAdded(true)
        setIsAdded(message)
        
      } catch (error) {
        console.log('error adding contacts', error)
      }
    }



 return (
  <div className="w-full h-full bg-black/40 backdrop-blur-sm fixed inset-0 flex items-center justify-center z-1000">
    <div className="w-4/12 bg-white rounded-2xl shadow-xl p-6">

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={handleExit}
          className="p-2 rounded-full hover:bg-gray-100 transition"
        >
          <CloseIcon />
        </button>

        {isAdded && (
          <p className="text-sm text-gray-500">
            {isAdded}
            <span className="text-red-500">*</span>
          </p>
        )}
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

      {/* Action */}
      <div className="mt-6">
        <button
          onClick={handleSubmit}
          className="w-full py-3 rounded-xl bg-[#2D4F2B] hover:bg-[#244022] transition text-white font-semibold shadow-md"
        >
          {isContactAdded ? 'Added' : 'Add Contact'}
        </button>
      </div>

    </div>
  </div>
);
}