import React, { useState } from "react";
import axios from "axios";
import CloseIcon from '@mui/icons-material/Close';
import { API_URL } from "../../../../../api";
import CircularProgress from '@mui/material/CircularProgress';

export default function UploadImages(props) {
  const exit = false
  const [video, setVideo] = useState(null);
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [title, setTitle] = useState("")
  const [isImageUploaded, setIsImageUploaded] = useState(false)
  



  const handleImageUpload = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("image", image);
    formData.append("title", title);
    formData.append("course_id", props.courseId);
    formData.append("chapter_id", props.chapterInfo.chapterId);

    try {
      setUploading(true);
      const res = await axios.post(`${API_URL}/admin/chapter/upload-image`, formData, {withCredentials:true});
      
      
      console.log("✅ Upload success:", res.data);
      setImage("")
      setTitle("")
      props.onExit(exit)
    } catch (error) {
      setIsImageUploaded(false)
      console.error("❌ Upload failed:", error);
    } finally {
      setUploading(false);
      setIsImageUploaded(true)
      
    }
    
  };

  return (
  <div className="fixed inset-0 z-50 grid place-items-center bg-black/50">
    <div className="w-6/15 bg-white rounded-xl shadow-xl overflow-hidden">

      {/* ===== HEADER ===== */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-[#6F8A6A]/40">
        <h1 className="text-xl font-semibold text-[#2D4F2B]">
          Upload Image
        </h1>
        <button
          onClick={() => props.onExit(exit)}
          className="w-9 h-9 flex items-center justify-center text-[#2D4F2B]"
        >
          <CloseIcon />
        </button>
      </div>

      {isImageUploaded ? (
        <div className="py-20 text-center">
          <p className="text-base font-medium text-[#2D4F2B]">
            ✔ Successfully uploaded image
          </p>
        </div>
      ) : (
        <form onSubmit={handleImageUpload} className="p-6 space-y-6">

          {/* ===== UPLOAD AREA ===== */}
          <div className="flex justify-center">
            <label
              className={`
                w-96 h-60
                rounded-xl
                border-2 border-dashed
                flex flex-col items-center justify-center
                cursor-pointer
                transition
                ${
                  uploading
                    ? "border-[#2D4F2B] bg-[#F1F3E0]/40"
                    : "border-[#6F8A6A] hover:bg-[#F1F3E0]"
                }
              `}
            >
              {/* Camera Icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`w-14 h-14 ${
                  uploading ? "text-[#2D4F2B]" : "text-[#6F8A6A]"
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 7h3l2-3h8l2 3h3v11a2 2 0 01-2 2H5a2 2 0 01-2-2V7z"
                />
                <circle cx="12" cy="13" r="4" />
              </svg>

              {!uploading && (
                <p className="mt-3 text-sm text-[#2D4F2B]">
                  Click to select image
                </p>
              )}

              {/* ===== FILE NAME CONFIRMATION (NO NEW LOGIC) ===== */}
              {image && !uploading && (
                <p className="mt-2 text-xs text-[#2D4F2B] truncate max-w-[90%]">
                  Selected: {image.name}
                </p>
              )}

              {uploading && (
                <p className="mt-3 text-sm font-medium text-[#2D4F2B]">
                  Uploading...
                </p>
              )}

              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImage(e.target.files[0])}
                required
                className="hidden"
              />
            </label>
          </div>

          {/* ===== TITLE INPUT ===== */}
          <div className="flex justify-center">
            <input
              type="text"
              placeholder="Image Title"
              required
              onChange={(e) => setTitle(e.target.value)}
              className="
                w-6/12 h-11 px-3
                rounded-lg
                border border-[#6F8A6A]
                text-[#2D4F2B]
                focus:outline-none
                focus:ring-2
                focus:ring-[#FFB823]
              "
            />
          </div>

          {/* ===== ACTION BUTTONS ===== */}
          <div className="flex justify-end gap-3 pt-4">

            <button
              type="button"
              onClick={() => props.onExit(exit)}
              className="
                h-11 px-6
                rounded-xl
                font-semibold
                text-[#2D4F2B]
                border border-[#2D4F2B]
                hover:bg-[#2D4F2B]
                hover:text-white
                transition
              "
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={uploading}
              className="
                h-11 px-6
                rounded-xl
                font-semibold
                bg-[#2D4F2B]
                text-white
                hover:bg-[#708A58]
                disabled:opacity-50
                disabled:cursor-not-allowed
                transition
              "
            >
              Upload
            </button>

          </div>
        </form>
      )}
    </div>
  </div>
);
}
