import React, {useEffect, useState, useRef} from 'react'
import {Link, Navigate} from 'react-router-dom'
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
import { API_URL } from '../../../../../api.js';
import DeleteIcon from '@mui/icons-material/Delete';

export default function AddChapterModal(props) {
    const exit = false
    const [title, setTitle] = useState("");
    const [message, setMessage] = useState("");
    const [isMouseOver, setMouseOver] = useState(false)

    const [isTextArea, setIsTextArea] = useState(false)
    const textareaRef = useRef(null);
   
    const [announcement, setAnnouncement] = useState([]);
    const [refresh, setRefresh] = useState(0)
    const [userId, setUserId] = useState("")

    useEffect(() => {
      const fectchdata = async()=>{
          const [fetch, user] = await Promise.all([axios.get(`${API_URL}/trainer/announcement/${props.courseId}`, {withCredentials:true}),
            axios.get(`${API_URL}/trainer/dashboard`, {withCredentials:true}),])
          setAnnouncement(fetch.data)
          console.log(fetch.data)
          setUserId(user.data.usersInfo.id)
          
      }
      fectchdata()
        

    }, [props.courseId, refresh]);

    const handleChange = (e) => {
      setMessage(e.target.value);

      const el = textareaRef.current;
      el.style.height = "auto"; // reset
      el.style.height = el.scrollHeight + "px"; // auto grow
    };

    const handleSubmit = async(e)=>{
      e.preventDefault()
      try {
        const postannounce = await axios.post(`${API_URL}/trainer/announcement`, 
          {courseId: props.courseId, title:title, message:message },
          {withCredentials:true})
          setRefresh(prev => prev +1)
          setTitle("")
          setMessage("")
      } catch (error) {
        console.log(error)
      }
      
    }
    const handleDelete = async (id)=>{
      try {
        const res = await axios.delete(
          `${API_URL}/trainer/announcement/delete/${id}`,
          { withCredentials: true }
        );
        setRefresh(prev => prev +1)
        console.log(res.data);
      } catch (error) {
        console.error(error);
      }
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

    
    



  return (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
    <div className="w-11/12 h-[90vh] bg-white rounded-xl shadow-xl flex flex-col">

      {/* ===== HEADER ===== */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-[#6F8A6A]/40">
        <h1 className="text-xl font-semibold text-[#2D4F2B]">
          Announcements
        </h1>
        <button
          onClick={() => props.onExit(exit)}
          className="w-9 h-9 flex items-center justify-center text-[#2D4F2B]"
        >
          <CloseIcon />
        </button>
      </div>

      {/* ===== BODY ===== */}
      <div className="flex-1 overflow-y-auto px-6 py-4">

        {/* Create Announcement Button (NO BOX) */}
        <div className="mb-6">
          <button
            onClick={() => setIsTextArea(true)}
            className="
              h-11 px-6
              rounded-xl
              font-semibold
              bg-[#2D4F2B]
              text-white
              hover:bg-[#708A58]
              transition
            "
          >
            Create Announcement
          </button>
        </div>

        {/* ===== CREATE ANNOUNCEMENT MODAL ===== */}
        {isTextArea && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <form
              onSubmit={handleSubmit}
              className="w-6/12 bg-white rounded-xl shadow-xl flex flex-col"
            >
              {/* Inner Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-[#6F8A6A]/40">
                <h2 className="text-lg font-semibold text-[#2D4F2B]">
                  Create Announcement
                </h2>
                <button
                  type="button"
                  onClick={() => setIsTextArea(false)}
                  className="w-9 h-9 flex items-center justify-center text-[#2D4F2B]"
                >
                  <CloseIcon />
                </button>
              </div>

              {/* Form Body */}
              <div className="px-6 py-5 flex flex-col gap-4">

                <div className="flex flex-col gap-1">
                  <label className="text-sm text-[#2D4F2B]">Title</label>
                  <input
                    type="text"
                    maxLength={25}
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter title"
                    className="
                      h-10 px-3
                      rounded-lg
                      border border-[#6F8A6A]
                      focus:outline-none
                      focus:ring-2
                      focus:ring-[#FFB823]
                    "
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-sm text-[#2D4F2B]">Message</label>
                  <textarea
                    ref={textareaRef}
                    value={message}
                    onChange={handleChange}
                    maxLength={480}
                    required
                    placeholder="Write your announcement here..."
                    className="
                      min-h-[120px] max-h-[200px]
                      px-3 py-2
                      rounded-lg
                      border border-[#6F8A6A]
                      resize-none
                      focus:outline-none
                      focus:ring-2
                      focus:ring-[#FFB823]
                    "
                  />
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    className="
                      w-40 h-10
                      rounded-xl
                      font-semibold
                      bg-[#2D4F2B]
                      text-white
                      hover:bg-[#708A58]
                      transition
                    "
                  >
                    SEND
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}

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

              {userId === item.user_id && (
                <button
                  className="ml-auto text-gray-400 hover:text-red-500 transition"
                  onClick={() => handleDelete(item.id)}
                >
                  <DeleteIcon />
                </button>
              )}
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
  </div>
);
}