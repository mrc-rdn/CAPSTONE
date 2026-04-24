import React, { useState } from "react";
import axios from "axios";
import CloseIcon from '@mui/icons-material/Close';
import { API_URL } from "../../../../api.js";

export default function UploadProfile(props) {
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [isImageUploaded, setIsImageUploaded] = useState(false);

  const handleImageUpload = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("image", image);

    try {
      setUploading(true);
      await axios.post(`${API_URL}/admin/EditProfile/UploadProfile`, formData, { withCredentials: true });
      setIsImageUploaded(true);
    } catch (error) {
      setIsImageUploaded(false);
      console.error("Upload failed:", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[250] flex items-center justify-center bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-sm p-4">
      <div className="w-[520px] max-w-full bg-white dark:bg-slate-900 backdrop-blur-xl border border-white/30 dark:border-slate-800 rounded-[2.5rem] shadow-2xl p-8 relative overflow-hidden transition-all duration-300">
        
        <button
          onClick={() => props.onExit(false)}
          className="absolute top-6 right-6 text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
        >
          <CloseIcon />
        </button>

        <p className="text-xl font-black text-slate-800 dark:text-white mb-8 text-center uppercase tracking-tight">
          Update Admin Photo
        </p>

        {isImageUploaded ? (
          <div className="flex flex-col items-center justify-center py-10 gap-4 animate-in fade-in zoom-in duration-500">
            <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-950/30 rounded-full flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <span className="text-3xl">✓</span>
            </div>
            <p className="text-emerald-600 dark:text-emerald-400 font-black uppercase tracking-widest text-[10px]">
              Profile Synchronized
            </p>
          </div>
        ) : (
          <form onSubmit={handleImageUpload} className="w-full flex flex-col items-center justify-center gap-8">
            <input
              className="w-full h-14 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-5 flex items-center justify-center pt-3.5 text-slate-500 dark:text-slate-400 font-bold cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 transition-all outline-none"
              type="file"
              onChange={(e) => setImage(e.target.files[0])}
              required
            />

            <button
              type="submit"
              disabled={uploading}
              className="w-full h-14 rounded-2xl font-black uppercase tracking-[0.2em] text-xs text-white bg-[#2D4F2B] hover:bg-[#1e361d] shadow-xl shadow-[#2D4F2B]/20 dark:shadow-none transition-all active:scale-95 disabled:opacity-60"
            >
              {uploading ? "Processing..." : "Apply Changes"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}