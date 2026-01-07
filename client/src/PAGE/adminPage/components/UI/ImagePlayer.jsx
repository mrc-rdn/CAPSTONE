import React, { useState } from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

export default function ImagePlayer(props) {
  const [zoom, setZoom] = useState(false);
  console.log(props.videoData)

  return (
  <div className="overflow-y-scroll w-full h-full">
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
    <h1 className="text-lg m-3 font-semibold ">
      Title: <span className="font-bold"> {props.videoData.title}</span>
      </h1>
  </div>
  );
}
