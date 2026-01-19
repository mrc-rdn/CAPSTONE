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
    
  console.log(props.videoData.title)
  

  return (
    <div className="w-full h-full " onClick={imageprogress}>
     
      <div className="w-full h-11/12 bg-black flex justify-center items-center overflow-hidden">

      
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
       <h1 className="text-lg m-3 font-semibold ">
      Title: <span className="font-bold"> {props.videoData.title}</span>
      </h1>
      
    </div>
  );
}
