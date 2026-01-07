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
    <div className='w-full h-full bg-gray-500/40 absolute grid place-items-center'>
      <div className='w-6/12 h-8/12 bg-white rounded-xl'>
        <div className="h-15 w-full bg-gray-200/90 rounded-tr-xl rounded-tl-xl p-4">
          <h1 className="text-xl font-semibold">Upload Video</h1>
        </div>
        {isUploadingDone?<p>success Uploading</p>
        :<form onSubmit={uploadVideo}>

          <div className="flex flex-col items-center justify-center mt-5">
            <div className="w-96 h-60 border-4 border-dashed border-gray-400 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition relative">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-12 h-12 text-gray-500 mb-3 z-100"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M12 12v8m0-8l-4 4m4-4l4 4M12 4v8 z-100" />
              </svg>
              <p className="text-gray-500 text-center px-4 z-100">
                click to select
              </p>
              <input
                type="file"
                accept="video/*"
                onChange={(e) => setVideo(e.target.files[0])}
                required
                className="bg-gray-200 w-full h-full file:text-center absolute rounded-lg"
              />
            </div>
          </div>
          
          <div className="w-full flex mt-9">
            <input
              type="text"
              placeholder="Video Title"
              className="w-5/12 h-10 bg-white rounded text-gray-500 font-semibold border-2 border-gray-400 ml-auto"
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <button onClick={()=>{props.onExit(exit)}} className="w-30 h-10 bg-white rounded text-gray-500 font-semibold border-2 border-gray-400 ml-auto">
              Cancel
            </button>
            <button type="submit" disabled={uploading} className="w-30 h-10 bg-blue-700 rounded text-white font-semibold mr-8 ml-5">
              {uploading ? "Uploading..." : "Upload"}
            </button>
          </div>
          
        </form>}
        

      </div> 
    </div>
  );
}
