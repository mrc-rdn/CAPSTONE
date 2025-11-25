import React, { useState } from "react";
import axios from "axios";
import CloseIcon from '@mui/icons-material/Close';
export default function UploadImages(props) {
  const exit = false
  const [video, setVideo] = useState(null);
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [title, setTitle] = useState("")
  



  const handleImageUpload = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("image", image);
    formData.append("title", title);
    formData.append("course_id", props.course_id);
    formData.append("order_index", props.chapter_details.index_chapter);
    formData.append("chapter_id", props.chapter_details.id);
    console.log(props.course_id,props.chapter_details.index_chapter, props.chapter_details.id)
    try {
      setUploading(true);
      const res = await axios.post("http://localhost:3000/admin/chapter/upload-image", formData, {withCredentials:true});
      
      
      console.log("✅ Upload success:", res.data);
    } catch (error) {
      console.error("❌ Upload failed:", error);
    } finally {
      setUploading(false);
      
    }
    
  };

  return (
    

    <div className='w-full h-full bg-gray-500/40 absolute grid place-items-center'>
      <div className='w-130 h-90 bg-white p-3 rounded'>
        <button onClick={()=>{props.onExit(exit), props.onRefresh(props.chapter_details.id)}}><CloseIcon /></button>
        <form onSubmit={handleImageUpload}>
          <input
            type="text"
            placeholder="Image Title"
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <input
            type="file"
            
            onChange={(e) => setImage(e.target.files[0])}
            required
          />

          <button type="submit" disabled={uploading}>
            {uploading ? "Uploading..." : "Upload"}
          </button>
        </form>
        

      </div> 
    </div>
  );
}
