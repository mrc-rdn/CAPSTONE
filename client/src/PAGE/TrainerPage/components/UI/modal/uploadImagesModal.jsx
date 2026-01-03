import React, { useState } from "react";
import axios from "axios";
import CloseIcon from '@mui/icons-material/Close';
import { API_URL } from "../../../../../api";
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
      const res = await axios.post(`${API_URL}/trainer/chapter/upload-image`, formData, {withCredentials:true});
      
      
      console.log("✅ Upload success:", res.data);

    } catch (error) {
      setIsImageUploaded(false)
      console.error("❌ Upload failed:", error);
    } finally {
      setUploading(false);
      setIsImageUploaded(true)
      
    }
    
  };

  return (
    

    <div className='w-full h-full bg-gray-500/40 absolute flex items-center justify-center '>
      <div className='w-10/12 h-100 bg-white p-3 rounded lg:w-4/12'>
        <button onClick={()=>{props.onExit(exit) }}><CloseIcon /></button>
        <p className="mb-7">Upload Image</p>
        {isImageUploaded?<p>success Uploading Image</p>
        :<form
          className='flex flex-col items-center '
          onSubmit={handleImageUpload}>
          <input
            className='w-10/12 h-10 text-2xl bg-green-500 rounded p-1 m-1'
            type="text"
            placeholder="Image Title"
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <input
            type="file"
             className='w-10/12 h-10 text-2xl bg-green-500 rounded p-1 m-1'
            onChange={(e) => setImage(e.target.files[0])}
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
