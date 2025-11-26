import React, { useState, useEffect } from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import {API_URL} from '../../../api.js'
import axios from 'axios'

export default function ImagePlayer(props) {
  const [zoom, setZoom] = useState(false);

  useEffect(()=>{
    const senddata = async()=>{
      try {
        console.log(props.videoData.chapter_id)
        const result = await axios.post(`${API_URL}/trainee/${props.videoId}/progressimage`,{
          chapterId:props.videoData.chapter_id, courseId:props.videoData.course_id
        },{withCredentials: true})
        console.log(result)
      } catch (error) {
        console.log(error)
      }
    }
    senddata()
  },[])

  return (
    <div className="w-full h-full bg-black flex justify-center items-center overflow-hidden">
      <TransformWrapper
        initialScale={1}
        wheel={{ step: 0.2 }}
        doubleClick={{ disabled: false }}
      >
        <TransformComponent>
          <img
            src={props.videoData.source_url}
            alt=""
            onClick={() => setZoom(!zoom)} // your original event
            className="cursor-pointer select-none"
            style={{
              maxWidth: "100%",
              height: "auto",
            }}
          />
        </TransformComponent>
      </TransformWrapper>
    </div>
  );
}
