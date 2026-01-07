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
      const res = await axios.post(`${API_URL}/trainee/EditProfile/UploadProfile`, formData, {withCredentials:true});
      
      console.log("Upload success:", res.data);
    } catch (error) {
      setIsImageUploaded(false)
      console.error(" Upload failed:", error);
    } finally {
      setUploading(false);
      setIsImageUploaded(true)
      props.onExit(exit)
      
    }
    
  };

  return (
    <div className='w-full h-full bg-gray-500/40 absolute grid place-items-center'>
      <div className='w-6/12 h-8/12 bg-white rounded-xl'>
        <div className="h-15 w-full bg-gray-200/90 rounded-tr-xl rounded-tl-xl p-4">
          <h1 className="text-xl font-semibold">Upload Profile</h1>
        </div>
        {isImageUploaded?<p>success Uploading</p>
        :<form onSubmit={handleImageUpload}>

          <div className="flex flex-col items-center justify-center mt-8">
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
                accept="image/*"
                onChange={(e) => setImage(e.target.files[0])}
                required
                className="bg-gray-200 w-full h-full file:text-center absolute rounded-lg"
              />
            </div>
          </div>
          
          <div className="w-full flex mt-15">
            
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
