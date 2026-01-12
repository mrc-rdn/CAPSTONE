import React, {useState} from 'react'
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
import DeleteIcon from '@mui/icons-material/Delete';
import { API_URL } from '../../../../../api.js';

export default function EditChapterModal(props) {
    const {chapterId, chapter_index, chapter_title, chapter_description} = props.chapterData;
    const [chapterTitle, setChapterTitle] = useState(chapter_title);
    const [chapterDescription, setChapterDescription] = useState(chapter_description);
    const [isDeleted, setDelete] = useState(false)

    const [isChapterAdded, setChapterAdded] = useState(false);
    const [isMouseOver, setMouseOver] = useState(false)
    

    async function handleSubmit(e){
      e.preventDefault();
      
      try {
        const result = axios.put(`${API_URL}/admin/course/editchapter`, 
            {title: chapterTitle, description: chapterDescription, courseId: props.courseId, chapterId:chapterId},
            {withCredentials: true})
        setChapterAdded(true)
        console.log(result.data)
        props.onExit()
      } catch (error) {
        console.log(error)
      }
        
        
    }
    const handleDelete = async (e) =>{
      e.preventDefault();
      console.log(chapterId)
      try {
        const res = await axios.delete(`${API_URL}/admin/chapter/deletechapter/${chapterId}`,{
          withCredentials: true
          })
          console.log(res)
          setDelete(true)
          setChapterAdded(true)
          props.onExit()
      } catch (error) {
        console.log('error deleting chapter',error)
      }
    }

    return (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
    <div className="w-[520px] bg-white rounded-xl shadow-lg">

      {/* ===== HEADER ===== */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-[#6F8A6A]/40">
        <h1 className="text-xl font-semibold text-[#2D4F2B]">
          Edit Chapter
        </h1>

        {/* Exit button – no hover */}
        <button
          onClick={() => props.onExit()}
          className="w-9 h-9 flex items-center justify-center text-[#2D4F2B]"
        >
          <CloseIcon />
        </button>
      </div>

      {/* ===== BODY ===== */}
      <div className="px-6 py-6">

        {/* Status Message */}
        {isChapterAdded ? (
          <div className="py-10 text-center">
            <p className="text-base font-medium text-[#2D4F2B]">
              {isDeleted ? "Chapter successfully deleted" : "Chapter successfully updated"}
            </p>
          </div>
        ) : (

          /* ===== FORM ===== */
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">

            {/* Chapter Title */}
            <div className="flex flex-col gap-1">
              <label className="text-sm text-[#2D4F2B]">
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
                  focus:outline-none
                  focus:ring-2
                  focus:ring-[#FFB823]
                "
              />
            </div>

            {/* Description */}
            <div className="flex flex-col gap-1">
              <label className="text-sm text-[#2D4F2B]">
                Description
              </label>
              <input
                type="text"
                required
                maxLength={40}
                placeholder="Enter short description"
                value={chapterDescription}
                onChange={(e) => setChapterDescription(e.target.value)}
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

            {/* ===== ACTION BUTTONS ===== */}
            <div className="flex justify-end items-center gap-3 pt-4">

              {/* Delete */}
              {chapter_index !== 1 && (
                <button
                  type="button"
                  onClick={handleDelete}
                  className="
                    flex items-center gap-2
                    px-4 h-10
                    w-40 h-11
                    rounded-xl
                    text-sm font-semibold
                    text-red-600
                    border border-red-300
                    hover:bg-red-50
                    transition
                  "
                >
                  <DeleteIcon fontSize="small" />
                  Delete Chapter
                </button>
              )}

              {/* Save Changes */}
              <button
                type="submit"
                className="
                  w-40 h-11
                  rounded-xl
                  font-semibold
                  bg-[#2D4F2B]
                  text-white
                  hover:bg-[#708A58]
                  focus:outline-none
                  focus:ring-2
                  focus:ring-[#FFB823]
                  transition
                "
              >
                Save Changes
              </button>

            </div>

          </form>
        )}
      </div>

    </div>
  </div>
);
}
