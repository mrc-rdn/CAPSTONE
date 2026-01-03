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


    console.log(video, title,props.courseId, props.chapterInfo.chapterId )
    try {
      setUploading(true);

      const response = await axios.post(
        `${API_URL}/trainer/chapter/uploadvideo`,
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
      <div className='w-10/12 h-100 bg-white p-3 rounded lg:w-4/12'>
        <button onClick={()=>{props.onExit(exit)}}><CloseIcon /></button>
        <p className="mb-7">Upload Video</p>
        {isUploadingDone?<p>success Uploading</p>
        :<form 
        className='flex flex-col items-center '
        onSubmit={uploadVideo}>
          <input
            className='w-10/12 h-10 text-2xl bg-green-500 rounded p-1 m-1'
            type="text"
            placeholder="Video Title"
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <input
            className='w-10/12 h-10 text-2xl bg-green-500 rounded p-1 m-1'
            type="file"
            accept="video/*"
            onChange={(e) => setVideo(e.target.files[0])}
            required
          />

          <button
          className="m-3 w-50 h-10 text-2xl text-white bg-green-500 rounded"
           type="submit" disabled={uploading}>
            {uploading ? "Uploading..." : "Upload"}
          </button>
        </form>}
        

      </div> 
    </div>
  );
}
