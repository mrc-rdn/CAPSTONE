// App.jsx
import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import axios from 'axios';

import { API_URL } from '../../../../../api';
import CloseIcon from '@mui/icons-material/Close';

export default function TextEditor(props) {
    const [content, setContent] = useState('');
    const [title, setTitle] = useState('');
    const [posts, setPosts] = useState([]);
    const [isPostingSuccess, setIspostingSuccess] = useState(false)
   

    const savePost = async () => {
        if (!title || !content) return alert("Title and content are required");
        try {
            const res = await axios.post(`${API_URL}/trainer/texteditor`,
                { title:title, courseId: props.courseId, chapterId: props.chapterInfo.chapterId, content: content },
                {withCredentials:true});
            setPosts([res.data, ...posts]);
            setTitle('');
            setContent('');
            setIspostingSuccess(true)
            props.onExit()
        } catch (err) {
            console.error(err);
            setIspostingSuccess(false)
        }
    };


    return (
  <div className="w-full h-full absolute inset-0 bg-white flex flex-col rounded-xl">

    {/* ===== HEADER ===== */}
    <div className="flex items-center justify-between px-6 py-4 border-b border-[#6F8A6A]/40">
      <h1 className="text-xl font-semibold text-[#2D4F2B]">
        Text Editor
      </h1>
      <button
        onClick={() => props.onExit()}
        className="w-9 h-9 flex items-center justify-center text-[#2D4F2B]"
      >
        <CloseIcon />
      </button>
    </div>

    {/* ===== CONTENT ===== */}
    {isPostingSuccess ? (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-base font-medium text-[#2D4F2B]">
          ✔ Successfully posted
        </p>
      </div>
    ) : (
      <div className="flex-1 flex flex-col px-6 py-5 gap-4 bg-white">

        {/* Title */}
        <input
          type="text"
          placeholder="Enter title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="
            w-full h-11 px-4
            rounded-lg
            border border-[#6F8A6A]
            text-[#2D4F2B]
            bg-white
            focus:outline-none
            focus:ring-2
            focus:ring-[#FFB823]
          "
        />

        {/* Editor */}
        <div className="flex-1 border border-[#6F8A6A] rounded-xl overflow-hidden bg-white">
          <ReactQuill
            value={content}
            onChange={setContent}
            className="h-full"
          />
        </div>

        {/* ===== FOOTER ===== */}
        <div className="flex justify-end pt-3">
          <button
            type="button"
            onClick={savePost}
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
            Save Post
          </button>
        </div>

      </div>
    )}
  </div>
);
}
