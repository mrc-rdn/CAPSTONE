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
      const res = await axios.post(`${API_URL}/trainer/EditProfile/UploadProfile`, formData, {withCredentials:true});
      
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
    

    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">

  <div className="w-[520px] max-w-[90%] h-[360px] bg-white/30 backdrop-blur-xl border border-white/30 rounded-2xl shadow-xl p-5 relative">

    <button
      onClick={()=>{props.onExit(exit)}}
      className="absolute top-4 right-4 text-gray-700 hover:text-red-500 transition"
    >
      <CloseIcon />
    </button>

    <p className="text-lg font-semibold text-white mb-6 text-center">
      Upload Profile Picture
    </p>

    {isImageUploaded
      ? (
        <p className="text-green-700 font-medium text-center mt-20">
          Successfully uploaded image
        </p>
      )
      : (
        <form
          onSubmit={handleImageUpload}
          className="w-full h-full flex flex-col items-center justify-center gap-6"
        >

          <input
            className="w-10/12 h-12 text-sm bg-white/40 backdrop-blur-md border border-white/40 rounded-xl px-3 cursor-pointer"
            type="file"
            onChange={(e) => setImage(e.target.files[0])}
            required
          />

          <button
            type="submit"
            disabled={uploading}
            className="
              w-48 h-11
              rounded-xl
              font-semibold
              text-[#2D4F2B]
              bg-white/50
              border-2 border-[#2D4F2B]/80
              hover:bg-[#2D4F2B]
              hover:text-white
              transition
              disabled:opacity-60
            "
          >
            {uploading ? "Uploading..." : "Upload"}
          </button>

        </form>
      )
    }

  </div>
</div>

  );
}