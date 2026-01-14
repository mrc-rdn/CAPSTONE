import React from 'react'

export default function messages(props) {
  console.log(props.message.first_name)
  console.log(props.userData)
  return (
  <div className="w-full">
    {props.message.first_name !== props.userData.first_name &&
    props.message.sender_id !== props.userData.id ? (
      // RECEIVER (LEFT)
      <div className="flex justify-start my-2">
        <div className="ml-3 inline-block max-w-[40%] rounded-xl bg-white/80 backdrop-blur-sm border border-black/10 px-4 py-2 shadow-sm">
          <p
            className="whitespace-pre-wrap text-sm text-gray-800"
            style={{ overflowWrap: "anywhere", wordBreak: "normal" }}
          >
            {props.message.message}
          </p>
        </div>
      </div>
    ) : (
      // SENDER (RIGHT)
      <div className="flex justify-end my-2">
        <div className="mr-3 inline-block max-w-[40%] rounded-xl bg-[#2D4F2B] px-4 py-2 shadow-md">
          <p
            className="whitespace-pre-wrap text-sm text-white"
            style={{ overflowWrap: "anywhere", wordBreak: "normal" }}
          >
            {props.message.message}
          </p>
        </div>
      </div>
    )}
  </div>
);
}
