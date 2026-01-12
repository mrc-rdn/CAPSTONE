import React, {useEffect, useState} from 'react'
import {Link, Navigate} from 'react-router-dom'
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
import { API_URL } from '../../../../../api.js';


export default function AddChapterModal(props) {
    const exit = false
    const [chapterTitle, setChapterTitle] = useState("");
    const [description, setDescription] = useState("");
    const [isChapterAdded, setChapterAdded] = useState(false);
    const [isMouseOver, setMouseOver] = useState(false)
    const [chapterLength, setChapterLength] = useState(0);
    useEffect(()=>{
      const fetchChapters = async () =>{
         const chapters = await axios.get(`${API_URL}/admin/course/${props.courseId}`, { withCredentials: true })
         setChapterLength(chapters.data.data.length)
      }
       fetchChapters()
       
    }, [])

    const handleSubmit = async(e)=>{
      e.preventDefault()
      try {
        const  result = await axios.post(`${API_URL}/admin/course/addchapter`, 
          {courseId: props.courseId, chapterName: chapterTitle, description: description, chapterIndex: chapterLength + 1},
          {withCredentials:true})
          
          setChapterAdded(result.data.success)
          props.onExit(exit)
      } catch (error) {
        setChapterAdded(false)
        console.log(error)
      }
      
    }



  return (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
    <div className="w-full max-w-xl bg-white rounded-xl shadow-lg">

      {/* ===== HEADER ===== */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-[#6F8A6A]/40">
        <h1 className="text-xl font-semibold text-[#2D4F2B]">
          Create Chapter
        </h1>

        {/* Exit */}
        <button
          onClick={() => props.onExit(exit)}
          className="w-9 h-9 flex items-center justify-center text-[#2D4F2B]"
        >
          <CloseIcon />
        </button>
      </div>

      {/* ===== BODY ===== */}
      <div className="px-6 py-6">

        {/* Success Message */}
        {isChapterAdded ? (
          <p className="text-center text-sm font-medium text-[#2D4F2B]">
            ✔ Chapter successfully added
          </p>
        ) : (
          <form className="flex flex-col gap-4">

            {/* Chapter Title */}
            <div className="flex flex-col">
              <label className="mb-1 text-sm text-[#2D4F2B]">
                Chapter Title
              </label>
              <input
                type="text"
                required
                maxLength={25}
                placeholder="Enter chapter title"
                value={chapterTitle}
                onChange={(e) => setChapterTitle(e.target.value)}
                className="
                  h-10 px-3
                  rounded-lg
                  border border-[#6F8A6A]
                  bg-white
                  text-[#2D4F2B]
                  focus:outline-none
                  focus:ring-2
                  focus:ring-[#FFB823]
                "
              />
            </div>

            {/* Description */}
            <div className="flex flex-col">
              <label className="mb-1 text-sm text-[#2D4F2B]">
                Description
              </label>
              <input
                type="text"
                required
                maxLength={40}
                placeholder="Enter short description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="
                  h-10 px-3
                  rounded-lg
                  border border-[#6F8A6A]
                  bg-white
                  text-[#2D4F2B]
                  focus:outline-none
                  focus:ring-2
                  focus:ring-[#FFB823]
                "
              />
            </div>

            {/* ===== SUBMIT BUTTON ===== */}
            <div className="w-full flex justify-center mt-6">
              <button
                type="button"
                onClick={handleSubmit}
                className="
                  w-60 h-11
                  rounded-xl
                  font-semibold
                  bg-[#2D4F2B]
                  text-white
                  hover:bg-[#708A58]
                  transition
                "
              >
                SUBMIT
              </button>
            </div>

          </form>
        )}
      </div>

    </div>
  </div>
);
}