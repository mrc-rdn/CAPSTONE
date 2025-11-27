import React, { useRef, useState, useEffect } from "react";
import axios from "axios";
import PauseIcon from '@mui/icons-material/Pause';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import Comments from "./Comments..jsx";
import { API_URL } from "../../../api.js";

export default function CustomVideoPlayer(props) {
  const { videoId, videoURL } = props
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isCompleted, setCompleted] = useState(false);

   const handleTimeUpdate = async() => {
      const video = videoRef.current;
      if (!video) return;
      if(!isCompleted){
        console.log('the video is not done wactching')
        if (video.currentTime === video.duration) {
          const result = await axios.post(`${API_URL}/trainee/${videoId}/completed`, {
          is_completed: true
          }, {withCredentials:true});
          console.log(result)
          
        } else {
          console.log('video not done watching')
        }
      }
      
    };

  

  // Play/Pause
  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (isPlaying) video.pause();
    else video.play();
    setIsPlaying(!isPlaying);
  };

  // Progress
  const handleProgress = () => {
    const video = videoRef.current;
    const percent = (video.currentTime / video.duration) * 100;
    setProgress(percent);
    setCurrentTime(video.currentTime);
  };

  const handleSeek = (e) => {
    const video = videoRef.current;
    const newTime = (e.target.value / 100) * video.duration;
    video.currentTime = newTime;
    setProgress(e.target.value);
  };

  // Volume
  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    videoRef.current.volume = newVolume;
    setVolume(newVolume);
  };

  // Fullscreen
  const toggleFullscreen = () => {
    const videoContainer = videoRef.current.parentElement;
    if (!document.fullscreenElement) {
      videoContainer.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const formatTime = (time) => {
    if (!time) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60)
      .toString()
      .padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  // Auto-hide controls
  useEffect(() => {
    let timeout;
    const show = () => {
      setShowControls(true);
      clearTimeout(timeout);
      timeout = setTimeout(() => setShowControls(false), 3000);
    };

    window.addEventListener("mousemove", show);
    return () => window.removeEventListener("mousemove", show);
  }, []);


  // Load & save progress
  useEffect(() => {
    const video = videoRef.current;

    const updateProgress = () => handleProgress();

    const saveProgressToDB = async () => {
      const currentSeconds = video.currentTime
      

      console.log(props.videoData.chapter_id,  props.videoData.course_id, video.duration)

    
      try {
        
        const result = await axios.post(`${API_URL}/trainee/${videoId}/progress`, {
          duration_seconds: currentSeconds,
          chapter_id: props.videoData.chapter_id, 
          course_id: props.videoData.course_id,
          is_completed: isCompleted
        }, {withCredentials:true});
        console.log(props.videoData.chapter_id,  props.videoData.course_id)
      } catch (err) {
        console.error("Failed to save progress:", err);
      }
    };

    const loadProgressFromDB = async () => {
      try {
        const res = await axios.get(`${API_URL}/trainee/${videoId}/progress`, {withCredentials: true});
        if (res.data.duration_seconds) {
          video.currentTime = res.data.duration_seconds;
          setCurrentTime(res.data.duration_seconds);
        }
        if(res.data.is_completed){
          setCompleted(true)
          console.log('done watchingdfasd')
        }else{
          setCompleted(false)
          console.log('not watchingdfasd')
        }

      } catch (err) {
        console.error("Failed to load progress:", err);
      }
    };

    loadProgressFromDB();

    video.addEventListener("timeupdate", updateProgress);
    video.addEventListener("timeupdate", saveProgressToDB);
    video.addEventListener("loadeddata", () => setDuration(video.duration));

    return () => {
      video.removeEventListener("timeupdate", updateProgress);
      video.removeEventListener("timeupdate", saveProgressToDB);
    };
  }, [videoId]);


    

  return (
    <div className="w-full h-full flex flex-col justify-center">
      <div className="overflow-y-scroll">
        <div className="relative bg-black w-full h-130">
          <video ref={videoRef} src={videoURL} className="w-full h-full" onTimeUpdate={handleTimeUpdate} controls={false} />

          {/* Controls Overlay */}
          <div className={`absolute bottom-0 left-0 right-0 transition-opacity duration-500 ${
            showControls ? "opacity-100" : "opacity-0"
          } bg-gradient-to-t from-black/80 to-transparent p-4 flex flex-col`}>
            <input
              type="range"
              min="0"
              max="100"
              value={progress}
              onChange={handleSeek}
              className="w-full accent-red-600 cursor-pointer"
            />

            <div className="flex items-center justify-between mt-2 text-white">
              <div className="flex items-center space-x-4">
                <button onClick={togglePlay} className="text-2xl bg-transparent">
                  {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
                </button>
                <span className="text-sm">{formatTime(currentTime)} / {formatTime(duration)}</span>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={volume}
                  onChange={handleVolumeChange}
                  className="w-24 accent-white cursor-pointer"
                />
              </div>
              <button onClick={toggleFullscreen} className="text-white text-xl">
                {isFullscreen ? "🗗" : "🗖"}
              </button>
            </div>
          </div>
        </div>
        <div className="w-full p-5">
          <Comments videoId={videoId} />
        </div>
      </div>
    </div>
  );
}
