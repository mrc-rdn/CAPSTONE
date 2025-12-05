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
      
    }
  }

  return (
    <div className='w-full h-full bg-gray-500/40 absolute grid place-items-center'>
      <div className='w-130 h-90 bg-white p-3 rounded'>
        <button onClick={()=>{props.onExit(exit)}}><CloseIcon /></button>
        {isUploadingDone?<p>success Uploading</p>
        :<form onSubmit={uploadVideo}>
          <input
            type="text"
            placeholder="Video Title"
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <input
            type="file"
            accept="video/*"
            onChange={(e) => setVideo(e.target.files[0])}
            required
          />

          <button type="submit" disabled={uploading}>
            {uploading ? "Uploading..." : "Upload"}
          </button>
        </form>}
        

      </div> 
    </div>
  );
}
