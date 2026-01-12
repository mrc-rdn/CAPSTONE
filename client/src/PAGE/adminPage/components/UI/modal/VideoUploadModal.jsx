import React, { useState } from "react";
import CloseIcon from '@mui/icons-material/Close';
import axios from "axios";
import { API_URL } from "../../../../../api";

export default function VideoUploadModal(props) {
  const exit = false
  const [video, setVideo] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [isUploadingDone, setUploadingDone] = useState(false)
  const [title, setTitle] = useState("");

  async function uploadVideo(e) {
    e.preventDefault();
   
    if (!video) {
      alert("Please select a video file first.");
      return;
    }

    const formData = new FormData();
    formData.append("video", video);
    formData.append("title", title);
    formData.append("course_id", props.courseId);
    formData.append("chapter_id", props.chapterInfo.chapterId);

    try {
      setUploading(true);

      const response = await axios.post(
        `${API_URL}/admin/chapter/uploadvideo`,
        formData,
        { withCredentials: true } 
      );

      console.log("✅ Upload success:", response.data);
      setUploadingDone(true)
    } catch (error) {
      console.error("❌ Upload failed:", error);
      setUploading(false)
    } finally {
      setUploading(false);
      props.onExit(exit)
      
    }
  }

  return (
  <div className="fixed inset-0 z-50 grid place-items-center bg-black/50">
    <div className="w-6/15 bg-white rounded-xl shadow-xl overflow-hidden">

      {/* ===== HEADER ===== */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-[#6F8A6A]/40">
        <h1 className="text-xl font-semibold text-[#2D4F2B]">
          Upload Video
        </h1>
        <button
          onClick={() => props.onExit(exit)}
          className="w-9 h-9 flex items-center justify-center text-[#2D4F2B]"
        >
          <CloseIcon />
        </button>
      </div>

      {isUploadingDone ? (
        <div className="py-20 text-center">
          <p className="text-base font-medium text-[#2D4F2B]">
            ✔ Successfully uploaded video
          </p>
        </div>
      ) : (
        <form onSubmit={uploadVideo} className="p-6 space-y-6">

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
                <polygon points="10,9 16,12 10,15" />
              </svg>

              {!uploading && (
                <p className="mt-3 text-sm text-[#2D4F2B]">
                  Click to select video
                </p>
              )}

              {/* ===== FILE NAME CONFIRMATION ===== */}
              {video && !uploading && (
                <p className="mt-2 text-xs text-[#2D4F2B] truncate max-w-[90%]">
                  Selected: {video.name}
                </p>
              )}

              {uploading && (
                <p className="mt-3 text-sm font-medium text-[#2D4F2B]">
                  Uploading...
                </p>
              )}

              <input
                type="file"
                accept="video/*"
                onChange={(e) => setVideo(e.target.files[0])}
                required
                className="hidden"
              />
            </label>
          </div>

          {/* ===== TITLE INPUT ===== */}
          <div className="flex justify-center">
            <input
              type="text"
              placeholder="Video Title"
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
              {uploading?'Uploading...':'Upload' }
            </button>

          </div>
        </form>
      )}
    </div>
  </div>
);
}
