import React, { useState, useEffect } from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import axios from "axios";
import { API_URL } from "../../../../api";

export default function ImagePlayer(props) {
  const [zoom, setZoom] = useState(false);

  
    const imageprogress = async()=>{
      try {
        const [postprogress, progress] = await Promise.all([ axios.post(`${API_URL}/trainee/${props.videoData.id}/progressimage`, 
          { chapterId: props.chapterId, courseId: props.courseId },
          {withCredentials:true}),
          axios.post(`${API_URL}/trainee/chapterprogress/${props.courseId}/${props.chapterId}`,{}, {withCredentials:true})

        ])
          console.log(postprogress, progress)
      } catch (error) {
        console.log(error)
      }
    }
    
  
  

  return (
    <div className="w-full h-full bg-black flex justify-center items-center overflow-hidden" onClick={imageprogress}>
      <TransformWrapper
        initialScale={1}
        wheel={{ step: 0.2 }}
        doubleClick={{ disabled: false }}
        
      >
        <TransformComponent>
          <img
            src={props.videoData.source_url}
            alt=""
            onClick={() => {setZoom(!zoom) }} // your original event
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
