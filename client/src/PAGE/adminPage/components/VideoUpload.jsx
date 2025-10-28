import React, { useState } from "react";
import axios from "axios";

export default function VideoUpload(props) {
  const [video, setVideo] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [title, setTitle] = useState("");

  async function uploadVideo(e) {
    e.preventDefault();
    console.log(props.chapter_details)
    if (!video) {
      alert("Please select a video file first.");
      return;
    }

    const formData = new FormData();
    formData.append("video", video);
    formData.append("title", title);
    formData.append("course_id", props.course_id);
    formData.append("order_index", props.chapter_details.chapter_index);
    formData.append("chapter_id", props.chapter_details.id);

    try {
      setUploading(true);

      const response = await axios.post(
        "http://localhost:3000/admin/chapter/uploadvideo",
        formData,
        { withCredentials: true } 
      );

      console.log("✅ Upload success:", response.data);
    } catch (error) {
      console.error("❌ Upload failed:", error);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <form onSubmit={uploadVideo}>
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
      </form>
    </div>
  );
}
