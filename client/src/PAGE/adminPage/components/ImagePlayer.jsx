import React, { useState } from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { API_URL } from "../../../api";

export default function ImagePlayer(props) {
  const [zoom, setZoom] = useState(false);

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
