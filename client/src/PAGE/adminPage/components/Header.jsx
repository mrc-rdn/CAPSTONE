import React from 'react'

export default function Header(props) {
  return (
    <div className="px-4 pt-4">
      <div className="flex w-full h-16 backdrop-blur-md bg-white/10 
    border border-black/10 rounded-xl shadow-md">
        <div className="h-full flex items-center w-full">
          <h1 className="text-xl font-bold text-[#2D4F2B] ml-3">
            {props.title}
          </h1>
        </div>
      </div>
    </div>

  )
}