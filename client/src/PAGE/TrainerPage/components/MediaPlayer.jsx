import React, { useRef, useState, useEffect } from "react";
import PauseIcon from '@mui/icons-material/Pause';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import Comments from "./Comments";

export default function CustomVideoPlayer(props) {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  // Toggle play/pause
  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (isPlaying) video.pause();
    else video.play();
    setIsPlaying(!isPlaying);
  };

  // Handle progress bar
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

  // Volume slider
  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    videoRef.current.volume = newVolume;
    setVolume(newVolume);
  };

  // Fullscreen toggle
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

  // Format time like 01:23
  const formatTime = (time) => {
    if (!time) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60)
      .toString()
      .padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  // Auto-hide controls after 3 seconds of inactivity
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

  // Setup video event listeners
  useEffect(() => {
    const video = videoRef.current;
    const updateProgress = () => handleProgress();
    const setLoadedData = () => setDuration(video.duration);

    video.addEventListener("timeupdate", updateProgress);
    video.addEventListener("loadeddata", setLoadedData);

    return () => {
      video.removeEventListener("timeupdate", updateProgress);
      video.removeEventListener("loadeddata", setLoadedData);
    };
  }, []);

  return (
  <div className="w-full h-full flex flex-col justify-center ">
   <div className="overflow-y-scroll">
    <div className="relative bg-black w-full h-130 ">
      <video
        ref={videoRef}
        src={props.videoURL}
        className="w-full h-full "
        controls={false}
      />

      {/* Controls Overlay */}
      <div
        className={`absolute bottom-0 left-0 right-0 transition-opacity duration-500 ${
          showControls ? "opacity-100" : "opacity-0"
        } bg-gradient-to-t from-black/80 to-transparent p-4 flex flex-col`}
      >
        {/* Progress Bar */}
        <input
          type="range"
          min="0"
          max="100"
          value={progress}
          onChange={handleSeek}
          className="w-full accent-red-600 cursor-pointer"
        />

        {/* Button Row */}
        <div className="flex items-center justify-between mt-2 text-white">
          <div className="flex items-center space-x-4">
            <button onClick={togglePlay} className="text-2xl bg-transparent">
              {isPlaying ?<PauseIcon /> : <PlayArrowIcon />}
            </button>

            <span className="text-sm">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>

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
      <Comments videoId={props.videoId} />
    </div>
   </div> 
  </div>
  );
}
