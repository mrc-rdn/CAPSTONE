import React, { useState } from 'react'
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
import { API_URL } from '../../../../api.js';

export default function SelectedProfile(props) {
  const [isContactAdded, setIsContactAdded] = useState(false)
  const [isAdded, setIsAdded] = useState("")

  const handleExit = () => props.onExit(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_URL}/trainer/addContact`, { user2_id: props.id }, { withCredentials: true })
      setIsContactAdded(true)
      setIsAdded(response.data.message)
    } catch (error) {
      console.log('error adding contacts', error)
    }
  }

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-[10000] p-4">
      <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl border border-slate-200/60 overflow-hidden">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 pb-0">
          <div className="flex flex-col">
             <h2 className="text-xl font-black text-slate-800 tracking-tight">User Profile</h2>
             {isAdded && <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">{isAdded}</p>}
          </div>
          <button onClick={handleExit} className="p-2 rounded-xl bg-slate-50 text-slate-400 hover:text-slate-600 transition-colors">
            <CloseIcon fontSize="small" />
          </button>
        </div>

        <div className="p-8 flex flex-col items-center text-center">
          {/* Avatar Area */}
          <div className="relative mb-6">
            {props.profile ? (
              <img src={props.profile} alt="" className="w-28 h-28 rounded-[2rem] object-cover border-4 border-white shadow-xl" />
            ) : (
              <div className={`w-28 h-28 rounded-[2rem] flex items-center justify-center text-white text-4xl font-black shadow-xl ${props.userColorClass}`}>
                {props.firstName?.slice(0, 1).toUpperCase()}
              </div>
            )}
            <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-emerald-500 border-4 border-white rounded-full" />
          </div>

          <h3 className="text-2xl font-black text-slate-800 tracking-tight">
            {props.firstName} {props.surname}
          </h3>
          <p className="text-sm font-bold text-slate-400 mb-1">@{props.username}</p>
          <p className="text-[10px] font-bold text-slate-300 uppercase tracking-tighter bg-slate-50 px-3 py-1 rounded-full">
            System ID: {props.id}
          </p>

          <button
            onClick={handleSubmit}
            className={`w-full mt-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all ${
              isContactAdded 
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                : 'bg-emerald-600 text-white shadow-lg shadow-emerald-200 hover:bg-emerald-700 active:scale-95'
            }`}
          >
            {isContactAdded ? 'Contact Added' : 'Add to Contacts'}
          </button>
        </div>
      </div>
    </div>
  );
}