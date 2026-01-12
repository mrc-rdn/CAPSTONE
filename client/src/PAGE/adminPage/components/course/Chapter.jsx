import React, {useState} from 'react'
import DehazeIcon from '@mui/icons-material/Dehaze';
import EditIcon from '@mui/icons-material/Edit';



export default function Chapter(props) {
  
  function handleClick(){
    props.handleOpenChapter(props.id, props.chapter_no)
    props.handleActiveChapter(props.id)
    
    console.log()
  }

   {/* Course Content */}
  return (
  <div
  onClick={handleClick}   
    className={`
      w-full
      h-20
      border border-gray-300
      flex items-start
      px-4 py-3
      transition
      cursor-pointer
      overflow-hidden
      ${props.isActive ? "bg-[#F1F3E0] text-black" : "bg-white hover:bg-[#F1F3E0]"}
    `}
  >
    
    {/* Text Content */}
    <div className="flex-1 min-w-0">
      <p className="text-lg font-medium truncate">
        {props.title}
      </p>

      <p className={`text-sm mt-1 leading-snug line-clamp-2 
        ${props.isActive ? "text-gray-600" : "text-gray-600"}
      `}>
        {props.description}
      </p>
    </div>

    {/* Actions */}
    {props.isEditChapter && (
      <div className="ml-4 flex items-center gap-3 shrink-0">

        <button
          onClick={(e) => {
            e.stopPropagation();
            props.handleShowEditChapterModal(
              props.id,
              props.chapter_no,
              props.title,
              props.description
            );
            props.onRefresh();
          }}
          className="text-gray-700 hover:text-green-700 transition"
        >
          <EditIcon />
        </button>

        <button className="text-gray-700 hover:text-green-700 transition cursor-move">
          <DehazeIcon />
        </button>

        <span className="text-xs text-black">
          {props.orderIndex}
        </span>

      </div>
    )}
  </div>
);
}