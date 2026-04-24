import React, { useState } from "react";
import axios from "axios";
import CloseIcon from '@mui/icons-material/Close';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { API_URL } from "../../../../api.js";
import { motion, AnimatePresence } from "framer-motion";

export default function UploadProfile(props) {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [isImageUploaded, setIsImageUploaded] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleImageUpload = async (e) => {
    e.preventDefault();
    if (!image) return;

    const formData = new FormData();
    formData.append("image", image);

    try {
      setUploading(true);
      await axios.post(`${API_URL}/trainee/EditProfile/UploadProfile`, formData, { withCredentials: true });
      setIsImageUploaded(true);
    } catch (error) {
      setIsImageUploaded(false);
      console.error("Upload failed:", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-[480px] max-w-full bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl border border-slate-200/60 dark:border-slate-800 p-8 relative overflow-hidden transition-all duration-300"
      >
        {/* Header Section */}
        <button
          onClick={() => props.onExit(false)}
          className="absolute top-6 right-6 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-red-500 transition-all"
        >
          <CloseIcon sx={{ fontSize: 20 }} />
        </button>

        <div className="text-center mb-8">
          <h2 className="text-lg font-black text-slate-800 dark:text-white uppercase tracking-tight">
            Identity Update
          </h2>
          <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mt-1">
            Professional Profile Picture
          </p>
        </div>

        <AnimatePresence mode="wait">
          {isImageUploaded ? (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center py-10 gap-4"
            >
              <div className="w-20 h-20 bg-emerald-50 dark:bg-emerald-950/30 rounded-[1.5rem] flex items-center justify-center text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800/50">
                <span className="text-3xl">✓</span>
              </div>
              <p className="text-emerald-600 dark:text-emerald-400 font-black uppercase tracking-widest text-[11px]">
                Synchronization Successful
              </p>
            </motion.div>
          ) : (
            <form onSubmit={handleImageUpload} className="space-y-6">
              {/* Profile Preview Circle */}
              <div className="flex flex-col items-center gap-4">
                <label className="relative cursor-pointer group">
                  <div className={`w-32 h-32 rounded-full border-4 flex items-center justify-center transition-all overflow-hidden ${
                    preview 
                      ? 'border-[#2D4F2B]' 
                      : 'border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50'
                  }`}>
                    {preview ? (
                      <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <CloudUploadIcon className="text-slate-300 dark:text-slate-600" sx={{ fontSize: 40 }} />
                    )}
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                  
                  {/* Floating Add Button */}
                  {!preview && (
                    <div className="absolute bottom-0 right-0 w-10 h-10 bg-[#2D4F2B] rounded-full flex items-center justify-center text-white shadow-lg border-4 border-white dark:border-slate-900 group-hover:scale-110 transition-transform">
                      <span className="text-xl font-bold">+</span>
                    </div>
                  )}
                </label>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  {preview ? "Click to change photo" : "Select your photo"}
                </p>
              </div>

              {/* Action Button */}
              <button
                type="submit"
                disabled={uploading || !image}
                className="w-full h-14 rounded-2xl font-black uppercase tracking-[0.2em] text-xs text-white bg-[#2D4F2B] hover:bg-[#1a301a] shadow-lg shadow-[#2D4F2B]/20 transition-all active:scale-[0.98] disabled:opacity-40 disabled:grayscale disabled:cursor-not-allowed mt-4"
              >
                {uploading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Processing...</span>
                  </div>
                ) : (
                  "Update Profile"
                )}
              </button>
            </form>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}