import React, { useState } from "react";
import axios from "axios";
import CloseIcon from '@mui/icons-material/Close';
import { API_URL } from "../../../../api.js";

export default function UploadProfile(props) {
  const exit = false
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [isImageUploaded, setIsImageUploaded] = useState(false)
  



  const handleImageUpload = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("image", image);


    try {
      setUploading(true);
      const res = await axios.post(`${API_URL}/admin/EditProfile/UploadProfile`, formData, {withCredentials:true});
      
      console.log("Upload success:", res.data);
    } catch (error) {
      setIsImageUploaded(false)
      console.error(" Upload failed:", error);
    } finally {
      setUploading(false);
      setIsImageUploaded(true)
      
    }
    
  };

  return (
    

    <div className='w-full h-full bg-gray-500/40 fixed inset-0 flex items-center justify-center '>
      <div className='w-130 h-90 bg-white p-3 rounded'>
        <button onClick={()=>{props.onExit(exit) }}><CloseIcon /></button>
        
        {isImageUploaded?<p>success Uploading Image</p>
        :<form onSubmit={handleImageUpload}>
          <input
            type="file"
            onChange={(e) => setImage(e.target.files[0])}
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
