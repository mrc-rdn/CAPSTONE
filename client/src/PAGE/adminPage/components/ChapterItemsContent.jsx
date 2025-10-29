import React from 'react'

export default function ChapterItemsContent(props) {
  return (
    <div>
      <video
          src={props.videoURL}
          controls
          autoPlay   // start playing automatically
          style={{ width: "100%", borderRadius: "10px" }}
        />
    
    </div>
  )
}

